'use client';

import { Button } from '@mantine/core';
import { IconArticle, IconBrandGithub, IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import AudioPlayer from '@/components/main/AudioPlayer';
import DockBar from '@/components/main/DockBar';
import { DockProvider } from '@/components/main/DockContext';
import DraggableWindow from '@/components/main/DraggableWindow';
import { WindowStackProvider } from '@/components/main/WindowStackContext';

type TerminalOverlayProps = {
	phrases?: string[];
};

export default function TerminalOverlay({ phrases }: TerminalOverlayProps) {
	const router = useRouter();
	const [windowPositions, setWindowPositions] = useState(() => ({
		main: { x: 0, y: 0 },
		view: { x: 220, y: 120 },
		bgm: { x: -220, y: 200 },
	}));
	const defaultPhrases = useMemo(
		() => [
			'오늘의 기록을 저장합니다.',
			'당신의 생각을 읽어들이는 중...',
			'Do you like LE SSERAFIM?',
			'읽는 사람에게 남을 문장을 고르는 중.',
		],
		[],
	);
	const activePhrases =
		phrases && phrases.length > 0 ? phrases : defaultPhrases;
	const [text, setText] = useState('');
	const [phraseIndex, setPhraseIndex] = useState(0);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isBgmPlaying, setIsBgmPlaying] = useState(false);

	useEffect(() => {
		const clamp = (value: number, min: number, max: number) =>
			Math.min(Math.max(value, min), max);
		const computePositions = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			const mainWidth = Math.min(720, width * 0.92);
			const viewWidth = Math.min(360, width * 0.78);
			const bgmWidth = Math.min(320, width * 0.8);
			const mainHeight = 240;
			const viewHeight = 170;
			const bgmHeight = 210;

			const maxOffsetX = (viewport: number, windowSize: number) =>
				Math.max(0, (viewport - windowSize) / 2);
			const maxOffsetY = (viewport: number, windowSize: number) =>
				Math.max(0, (viewport - windowSize) / 2);

			const mainX = 0;
			const mainY = width < 640 ? -80 : -20;
			const viewX = width < 640 ? 0 : 220;
			const viewY = width < 640 ? 160 : 120;
			const bgmX = width < 640 ? 0 : -220;
			const bgmY = width < 640 ? 320 : 200;

			setWindowPositions({
				main: {
					x: clamp(mainX, -maxOffsetX(width, mainWidth), maxOffsetX(width, mainWidth)),
					y: clamp(mainY, -maxOffsetY(height, mainHeight), maxOffsetY(height, mainHeight)),
				},
				view: {
					x: clamp(viewX, -maxOffsetX(width, viewWidth), maxOffsetX(width, viewWidth)),
					y: clamp(viewY, -maxOffsetY(height, viewHeight), maxOffsetY(height, viewHeight)),
				},
				bgm: {
					x: clamp(bgmX, -maxOffsetX(width, bgmWidth), maxOffsetX(width, bgmWidth)),
					y: clamp(bgmY, -maxOffsetY(height, bgmHeight), maxOffsetY(height, bgmHeight)),
				},
			});
		};

		computePositions();
		window.addEventListener('resize', computePositions);
		return () => window.removeEventListener('resize', computePositions);
	}, []);

	useEffect(() => {
		const phrase = activePhrases[phraseIndex];
		let nextText = text;
		let nextDeleting = isDeleting;
		let nextPhraseIndex = phraseIndex;
		let delay = isDeleting ? 50 : 90;

		if (!isDeleting && text === phrase) {
			nextDeleting = true;
			delay = 1400;
		} else if (isDeleting && text === '') {
			nextDeleting = false;
			nextPhraseIndex = (phraseIndex + 1) % activePhrases.length;
			delay = 400;
		} else {
			nextText = isDeleting
				? phrase.slice(0, Math.max(0, text.length - 1))
				: phrase.slice(0, text.length + 1);
		}

		const timeout = window.setTimeout(() => {
			setText(nextText);
			setIsDeleting(nextDeleting);
			setPhraseIndex(nextPhraseIndex);
		}, delay);

		return () => window.clearTimeout(timeout);
	}, [activePhrases, phraseIndex, isDeleting, text]);

	return (
		<DockProvider>
			<WindowStackProvider>
				<div
					className="pointer-events-none fixed inset-0 z-1 grid place-items-center p-6"
					aria-hidden
				>
					<DraggableWindow
						title="hahbr88"
						onCloseRequest={() => setIsModalOpen(true)}
						dockLabel="Terminal"
						initialPosition={windowPositions.main}
					>
						<div className="px-6 pt-[26px] pb-[30px] max-[640px]:px-[18px] max-[640px]:pt-[22px] max-[640px]:pb-[26px]">
							<div className="flex items-center gap-2.5 whitespace-pre-wrap font-mono text-[clamp(16px,2.3vw,24px)] text-[rgba(200,255,220,0.95)] [text-shadow:0_0_12px_rgba(80,255,160,0.4)] max-[640px]:gap-2">
								<span className="text-[rgba(120,255,160,0.85)]">$</span>
								<span className="min-h-[1em]">
									{'SA 엔지니어 하병로의 블로그입니다.'}
								</span>
							</div>
							<div className="flex items-center gap-2.5 whitespace-pre-wrap font-mono text-[clamp(16px,2.3vw,24px)] text-[rgba(200,255,220,0.95)] [text-shadow:0_0_12px_rgba(80,255,160,0.4)] max-[640px]:gap-2">
								<span className="text-[rgba(120,255,160,0.85)]">$</span>
								<span className="min-h-[1em]">{text}</span>
								<span className="inline-block h-[1.2em] w-2.5 animate-[blink_0.9s_steps(1)_infinite] bg-[rgba(160,255,200,0.9)] shadow-[0_0_12px_rgba(80,255,160,0.6)]" />
							</div>
						</div>
					</DraggableWindow>
					<DraggableWindow
						title="view me"
						dockLabel="View Me"
						onCloseRequest={() => setIsModalOpen(true)}
						normalClassName="w-[min(360px,78vw)]"
						initialPosition={windowPositions.view}
					>
						<div className="pointer-events-auto flex flex-wrap gap-2 p-5">
							<Button
								className="w-[calc(50%-0.25rem)]!"
								variant="terminal"
								onClick={() => router.push('/aboutme')}
								leftSection={<IconUser />}
							>
								About Me
							</Button>
							<Button
								className="w-[calc(50%-0.25rem)]!"
								variant="terminal"
								onClick={() => router.push('/posts')}
								leftSection={<IconArticle />}
							>
								View Posts
							</Button>
							<Button
								className="w-full!"
								variant="terminal"
								onClick={() => router.push('https://github.com/hahbr88')}
								leftSection={<IconBrandGithub />}
							>
								My github
							</Button>
						</div>
					</DraggableWindow>
					<DraggableWindow
						title="very nice music"
						dockLabel="BGM"
						normalClassName="w-[min(320px,80vw)]"
						initialPosition={windowPositions.bgm}
						effectClassName={isBgmPlaying ? 'animate-terminal-window-shake' : ''}
					>
						<AudioPlayer
							title="BGM"
							src="/bgm/bgm.m4a"
							captionsSrc="/bgm/bgm.vtt"
							autoPlayMuted
							creditText="LE SSERAFIM ✕ ILLIT ✕ aespa | 바로 궁전가는 하우스 리믹스 [Mixset]"
							creditUrl="https://youtu.be/PVPnrzYYqMk?si=orAYTdP-PRvUUlDk"
							onPlayingChange={setIsBgmPlaying}
						/>
					</DraggableWindow>
					{isModalOpen ? (
						<div className="pointer-events-auto fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-6">
							<div className="w-full max-w-sm rounded-2xl border border-[rgba(120,255,160,0.2)] bg-[linear-gradient(180deg,rgba(8,12,8,0.96),rgba(3,6,4,0.92))] p-6 text-zinc-100 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
								<p className="text-[rgba(120,255,160,0.7)] text-xs uppercase tracking-[0.3em]">
									Access Deny
								</p>
								<p className="mt-3 text-sm text-zinc-300">
									이 창은 못 닫아! 아직 내 이야기가 남아있다구.
								</p>
								<div className="mt-5 flex justify-end">
									<Button
										variant="terminal"
										onClick={() => setIsModalOpen(false)}
									>
										Accept
									</Button>
								</div>
							</div>
						</div>
					) : null}
				</div>
				<DockBar />
			</WindowStackProvider>
		</DockProvider>
	);
}
