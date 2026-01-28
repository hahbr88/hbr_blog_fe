'use client';

import BackgroundCanvas from '@/components/main/BackgroundCanvas';
import TerminalOverlay from '@/components/main/TerminalOverlay';

export default function Home() {
	return (
		<div className="relative min-h-screen overflow-hidden bg-black font-sans text-zinc-100">
			<BackgroundCanvas />
			<main className="relative z-10 min-h-screen w-full px-4 py-6 sm:px-8 sm:py-10 lg:px-16 lg:py-14">
				<TerminalOverlay />
			</main>
		</div>
	);
}
