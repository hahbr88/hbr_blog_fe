'use client';

import { useEffect, useRef } from 'react';

type Direction = 'down' | 'up' | 'mixed';

export default function MatrixBackground({
	direction = 'mixed',
	density = 1, // 1 = 기본, 2 = 더 촘촘
	fps = 30,
}: {
	direction?: Direction;
	density?: number;
	fps?: number;
}) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current!;
		const ctx = canvas.getContext('2d')!;
		let raf = 0;

		// DPR 대응(선명도)
		const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));

		// 설정
		const fontSize = 16; // px
		const chars =
			'ㅍㅣㅇㅓㄴㅏㄹㅏㄹㅡㅅㅔㄹㅏㅍㅣㅁㅎㅂㄴ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';

		let width = 0;
		let height = 0;
		let columns = 0;

		// 각 column의 “진행 위치”
		let drops: number[] = [];
		// 각 column별 속도/방향(불규칙)
		let speeds: number[] = [];
		let dirs: number[] = [];

		const rand = (min: number, max: number) =>
			Math.random() * (max - min) + min;

		const resize = () => {
			width = window.innerWidth;
			height = window.innerHeight;

			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			canvas.width = Math.floor(width * dpr);
			canvas.height = Math.floor(height * dpr);

			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			columns = Math.floor((width / fontSize) * density);

			drops = new Array(columns)
				.fill(0)
				.map(() => Math.floor(rand(0, height / fontSize)));
			speeds = new Array(columns).fill(0).map(() => rand(0.5, 2.2));
			dirs = new Array(columns).fill(0).map(() => {
				if (direction === 'down') return 1;
				if (direction === 'up') return -1;
				// mixed
				return Math.random() < 0.8 ? 1 : -1; // 대부분 아래, 일부 위
			});
		};

		resize();
		window.addEventListener('resize', resize);

		// FPS 제어(필요 시)
		const frameInterval = 1000 / fps;
		let lastTime = performance.now();

		const draw = (time: number) => {
			const delta = time - lastTime;
			if (delta < frameInterval) {
				raf = requestAnimationFrame(draw);
				return;
			}
			lastTime = time;

			// 잔상(트레일) — 완전 삭제가 아니라 알파로 덮기
			ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
			ctx.fillRect(0, 0, width, height);

			ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;

			for (let i = 0; i < columns; i++) {
				const x = i * (fontSize / density);
				const y = drops[i] * fontSize;

				const text = chars[Math.floor(Math.random() * chars.length)];

				// 랜덤 밝기/반짝임
				const glow = Math.random() < 0.02;
				ctx.fillStyle = glow
					? 'rgba(180, 255, 180, 1)'
					: 'rgba(0, 255, 70, 0.9)';

				ctx.fillText(text, x, y);

				// 진행
				drops[i] += speeds[i] * dirs[i];

				// 리셋(불규칙)
				const offBottom = y > height && dirs[i] > 0;
				const offTop = y < 0 && dirs[i] < 0;

				if (offBottom || offTop) {
					if (Math.random() > 0.92) {
						drops[i] = dirs[i] > 0 ? 0 : Math.floor(height / fontSize);
						speeds[i] = rand(0.5, 2.2);
						// 방향도 가끔 뒤집기
						if (direction === 'mixed' && Math.random() < 0.1) dirs[i] *= -1;
					}
				}
			}

			raf = requestAnimationFrame(draw);
		};

		raf = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
		};
	}, [direction, density, fps]);

	return (
		<canvas
			ref={canvasRef}
			aria-hidden
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 0,
				background: 'black',
			}}
		/>
	);
}
