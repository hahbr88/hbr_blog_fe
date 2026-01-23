'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';

type DraggableWindowProps = {
	title?: string;
	children: ReactNode;
	onCloseRequest?: () => void;
	dockLabel?: string;
	normalClassName?: string;
	maximizedClassName?: string;
	initialPosition?: { x: number; y: number };
	floating?: boolean;
};

export default function DraggableWindow({
	title = 'terminal',
	children,
	onCloseRequest,
	dockLabel = 'Terminal',
	normalClassName = 'w-[min(720px,92vw)]',
	maximizedClassName = 'h-[min(80vh,720px)] w-[min(1100px,96vw)]',
	initialPosition = { x: 0, y: 0 },
	floating = true,
}: DraggableWindowProps) {
	const [isMinimized, setIsMinimized] = useState(false);
	const [isMaximized, setIsMaximized] = useState(false);
	const [position, setPosition] = useState(initialPosition);
	const [isDragging, setIsDragging] = useState(false);
	const positionRef = useRef(position);
	const windowRef = useRef<HTMLDivElement | null>(null);
	const [windowSize, setWindowSize] = useState({ width: 720, height: 420 });
	const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
	const dragRef = useRef({
		startX: 0,
		startY: 0,
		originX: 0,
		originY: 0,
	});
	const dragPosRef = useRef(position);

	useEffect(() => {
		positionRef.current = position;
		dragPosRef.current = position;
	}, [position]);

	const updateSizes = useCallback(() => {
		if (windowRef.current) {
			const rect = windowRef.current.getBoundingClientRect();
			setWindowSize({ width: rect.width, height: rect.height });
		}
		setViewportSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	}, []);

	useEffect(() => {
		updateSizes();
		window.addEventListener('resize', updateSizes);
		return () => window.removeEventListener('resize', updateSizes);
	}, [updateSizes]);

	const liveTransform = useCallback(
		(x: number, y: number) =>
			floating
				? `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0)`
				: `translate3d(${x}px, ${y}px, 0)`,
		[floating],
	);

	useEffect(() => {
		if (!isDragging || isMinimized) return;

		const handleMove = (event: PointerEvent) => {
			const dx = event.clientX - dragRef.current.startX;
			const dy = event.clientY - dragRef.current.startY;
			const nextX = dragRef.current.originX + dx;
			const nextY = dragRef.current.originY + dy;
			const maxOffsetX = Math.max(0, viewportSize.width - windowSize.width);
			const maxOffsetY = Math.max(0, viewportSize.height - windowSize.height);
			const minX = floating ? -maxOffsetX / 2 : 0;
			const maxX = floating ? maxOffsetX / 2 : maxOffsetX;
			const minY = floating ? -maxOffsetY / 2 : 0;
			const maxY = floating ? maxOffsetY / 2 : maxOffsetY;
			const clampedX = Math.min(Math.max(nextX, minX), maxX);
			const clampedY = Math.min(Math.max(nextY, minY), maxY);
			dragPosRef.current = {
				x: clampedX,
				y: clampedY,
			};
			if (windowRef.current) {
				windowRef.current.style.transform = liveTransform(
					dragPosRef.current.x,
					dragPosRef.current.y,
				);
			}
		};

		const handleUp = () => {
			setIsDragging(false);
			setPosition(dragPosRef.current);
		};

		window.addEventListener('pointermove', handleMove);
		window.addEventListener('pointerup', handleUp);
		return () => {
			window.removeEventListener('pointermove', handleMove);
			window.removeEventListener('pointerup', handleUp);
		};
	}, [isDragging, isMinimized, liveTransform]);

	const handleDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (isMinimized) return;
		event.preventDefault();
		dragRef.current = {
			startX: event.clientX,
			startY: event.clientY,
			originX: positionRef.current.x,
			originY: positionRef.current.y,
		};
		dragPosRef.current = positionRef.current;
		setIsDragging(true);
	};

	const handleMinimize = () => {
		setIsMinimized(true);
		setIsDragging(false);
	};

	const handleRestore = () => {
		setIsMinimized(false);
	};

	const handleToggleMaximize = () => {
		setIsMaximized((prev) => !prev);
		setPosition({ x: 0, y: 0 });
		dragPosRef.current = { x: 0, y: 0 };
		requestAnimationFrame(updateSizes);
	};

	const minimizeOffsetX =
		viewportSize.width / 2 - windowSize.width / 2 - 24;
	const minimizeOffsetY =
		viewportSize.height / 2 - windowSize.height / 2 - 24;

	const minimizedTransform = useMemo(
		() =>
			floating
				? `translate3d(calc(-50% + ${position.x + minimizeOffsetX}px), calc(-50% + ${
						position.y + minimizeOffsetY
				  }px), 0) scale(0.1)`
				: `translate3d(${position.x + minimizeOffsetX}px, ${
						position.y + minimizeOffsetY
				  }px, 0) scale(0.1)`,
		[position.x, position.y, minimizeOffsetX, minimizeOffsetY, floating],
	);

	const normalTransform = useMemo(
		() =>
			floating
				? `translate3d(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px), 0)`
				: `translate3d(${position.x}px, ${position.y}px, 0)`,
		[position.x, position.y, floating],
	);

	const windowSizeClassName = isMaximized ? maximizedClassName : normalClassName;
	const floatingClassName = floating ? 'absolute left-1/2 top-1/2' : '';

	return (
		<>
			<div
				ref={windowRef}
				className={`pointer-events-auto rounded-2xl border border-[rgba(120,255,160,0.25)] bg-[linear-gradient(180deg,rgba(8,12,8,0.92),rgba(2,4,3,0.86))] shadow-[0_24px_80px_rgba(0,0,0,0.5),0_0_40px_rgba(40,255,120,0.15)] backdrop-blur-[6px] transition-[transform,opacity,width,height] duration-300 will-change-transform ${floatingClassName} ${windowSizeClassName} ${
					isMinimized ? 'pointer-events-none opacity-0' : 'opacity-100'
				} ${isDragging ? '!transition-none' : ''}`}
				style={{
					transform: isMinimized ? minimizedTransform : normalTransform,
				}}
			>
				<div
					className="flex cursor-grab select-none items-center gap-2 rounded-t-2xl border-[rgba(120,255,160,0.15)] border-b bg-[rgba(6,12,6,0.6)] px-3.5 py-2.5 font-mono text-[12px] text-[rgba(150,255,190,0.7)] uppercase tracking-[0.2em] active:cursor-grabbing"
					onPointerDown={handleDragStart}
				>
					<button
						type="button"
						className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff5f56] shadow-[0_0_8px_rgba(0,0,0,0.6)]"
						onPointerDown={(event) => event.stopPropagation()}
						onClick={onCloseRequest}
					/>
					<button
						type="button"
						className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ffbd2e] shadow-[0_0_8px_rgba(0,0,0,0.6)]"
						onPointerDown={(event) => event.stopPropagation()}
						onClick={handleMinimize}
					/>
					<button
						type="button"
						className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#27c93f] shadow-[0_0_8px_rgba(0,0,0,0.6)]"
						onPointerDown={(event) => event.stopPropagation()}
						onClick={handleToggleMaximize}
					/>
					<span className="ml-auto">{title}</span>
				</div>
				<div>{children}</div>
			</div>
			{isMinimized ? (
				<button
					type="button"
					className="pointer-events-auto fixed right-6 bottom-6 flex items-center gap-2 rounded-full border border-[rgba(120,255,160,0.2)] bg-[rgba(6,12,6,0.7)] px-4 py-2 font-mono text-[rgba(150,255,190,0.75)] text-xs uppercase tracking-[0.2em] shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-105"
					onClick={handleRestore}
				>
					<span className="inline-block h-2 w-2 rounded-full bg-[#27c93f]" />
					{dockLabel}
				</button>
			) : null}
		</>
	);
}
