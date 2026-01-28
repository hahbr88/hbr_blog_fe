'use client';

import { IconMaximize, IconMinus, IconX } from '@tabler/icons-react';
import type { ReactNode, PointerEvent as ReactPointerEvent } from 'react';
import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useDock } from '@/components/main/DockContext';
import { useWindowStack } from '@/components/main/WindowStackContext';

type DraggableWindowProps = {
	title?: string;
	children: ReactNode;
	onCloseRequest?: () => void;
	dockLabel?: string;
	normalClassName?: string;
	maximizedClassName?: string;
	initialPosition?: { x: number; y: number };
	floating?: boolean;
	effectClassName?: string;
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
	effectClassName,
}: DraggableWindowProps) {
	const id = useId();
	const { registerDockItem, unregisterDockItem } = useDock();
	const { bringToFront, getZIndex, register, unregister } = useWindowStack();
	const [isMinimized, setIsMinimized] = useState(false);
	const [isMaximized, setIsMaximized] = useState(false);
	const [position, setPosition] = useState(initialPosition);
	const [isDragging, setIsDragging] = useState(false);
	const positionRef = useRef(position);
	const prevPositionRef = useRef(initialPosition);
	const didUserMoveRef = useRef(false);
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

	useEffect(() => {
		if (didUserMoveRef.current || isMaximized || isMinimized) return;
		setPosition(initialPosition);
		dragPosRef.current = initialPosition;
		positionRef.current = initialPosition;
	}, [initialPosition, isMaximized, isMinimized]);

	useEffect(() => {
		register(id);
		return () => unregister(id);
	}, [id, register, unregister]);

	useEffect(() => {
		if (!isMinimized) return;
		registerDockItem({
			id,
			label: dockLabel,
			onRestore: () => {
				setIsMinimized(false);
				unregisterDockItem(id);
			},
		});
		return () => unregisterDockItem(id);
	}, [dockLabel, id, isMinimized, registerDockItem, unregisterDockItem]);

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

	useEffect(() => {
		const node = windowRef.current;
		if (!node) return;
		const observer = new ResizeObserver(() => updateSizes());
		observer.observe(node);
		return () => observer.disconnect();
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
	}, [
		isDragging,
		isMinimized,
		liveTransform,
		viewportSize.width,
		viewportSize.height,
		windowSize.width,
		windowSize.height,
		floating,
	]);

	const handleDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (isMinimized || isMaximized) return;
		event.preventDefault();
		didUserMoveRef.current = true;
		bringToFront(id);
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

	const handleToggleMaximize = () => {
		didUserMoveRef.current = true;
		const nextMaximized = !isMaximized;
		setIsMaximized(nextMaximized);
		if (nextMaximized) {
			prevPositionRef.current = positionRef.current;
			setPosition({ x: 0, y: 0 });
			dragPosRef.current = { x: 0, y: 0 };
		} else {
			setPosition(prevPositionRef.current);
			dragPosRef.current = prevPositionRef.current;
		}
		setIsDragging(false);
		requestAnimationFrame(updateSizes);
	};

	const minimizeOffsetX = viewportSize.width / 2 - windowSize.width / 2 - 24;
	const minimizeOffsetY = viewportSize.height / 2 - windowSize.height / 2 - 24;

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

	const normalTransform = useMemo(() => {
		if (isMaximized) return 'translate3d(0, 0, 0)';
		return floating
			? `translate3d(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px), 0)`
			: `translate3d(${position.x}px, ${position.y}px, 0)`;
	}, [floating, isMaximized, position.x, position.y]);

	const windowSizeClassName = isMaximized ? 'h-screen w-screen' : normalClassName;
	const windowShapeClassName = isMaximized ? 'rounded-none' : 'rounded-2xl';
	const floatingClassName = isMaximized
		? 'fixed inset-0'
		: floating
			? 'absolute left-1/2 top-1/2'
			: '';

	return (
		<>
			<div
				ref={windowRef}
				className={`pointer-events-auto transition-[transform,opacity,width,height] duration-300 will-change-transform ${floatingClassName} ${windowSizeClassName} ${
					isMinimized ? 'pointer-events-none opacity-0' : 'opacity-100'
				} ${isDragging ? '!transition-none' : ''}`}
				style={{
					transform: isMinimized ? minimizedTransform : normalTransform,
					zIndex: getZIndex(id),
				}}
				onPointerDownCapture={() => bringToFront(id)}
			>
				<div
					className={`h-full w-full border border-[rgba(120,255,160,0.25)] bg-[linear-gradient(180deg,rgba(8,12,8,0.92),rgba(2,4,3,0.86))] shadow-[0_24px_80px_rgba(0,0,0,0.5),0_0_40px_rgba(40,255,120,0.15)] backdrop-blur-[6px] ${windowShapeClassName} ${effectClassName ?? ''}`}
				>
					<div
						className={`flex touch-none select-none items-center gap-2 border-[rgba(120,255,160,0.15)] border-b bg-[rgba(6,12,6,0.6)] px-3.5 py-2.5 font-mono text-[12px] text-[rgba(150,255,190,0.7)] uppercase tracking-[0.2em] ${
							isMaximized
								? 'cursor-default'
								: 'cursor-grab active:cursor-grabbing'
						} ${windowShapeClassName === 'rounded-2xl' ? 'rounded-t-2xl' : ''}`}
						onPointerDown={handleDragStart}
					>
						<div className="group flex gap-2">
							<button
								type="button"
								className="relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff5f56] shadow-[0_0_8px_rgba(0,0,0,0.6)]"
								onPointerDown={(event) => event.stopPropagation()}
								onClick={onCloseRequest}
							>
								<IconX
									aria-hidden
									size={10}
									className="text-black/70 opacity-0 transition group-hover:opacity-100"
								/>
							</button>
							<button
								type="button"
								className="relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ffbd2e] shadow-[0_0_8px_rgba(0,0,0,0.6)]"
								onPointerDown={(event) => event.stopPropagation()}
								onClick={handleMinimize}
							>
								<IconMinus
									aria-hidden
									size={10}
									className="text-black/70 opacity-0 transition group-hover:opacity-100"
								/>
							</button>
							<button
								type="button"
								className="relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#27c93f] shadow-[0_0_8px_rgba(0,0,0,0.6)]"
								onPointerDown={(event) => event.stopPropagation()}
								onClick={handleToggleMaximize}
							>
								<IconMaximize
									aria-hidden
									size={10}
									className="text-black/70 opacity-0 transition group-hover:opacity-100"
								/>
							</button>
						</div>
						<span className="ml-auto">{title}</span>
					</div>
					{children}
				</div>
			</div>
			{isMinimized ? null : null}
		</>
	);
}
