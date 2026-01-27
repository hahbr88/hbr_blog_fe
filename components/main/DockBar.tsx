'use client';

import { useDock } from '@/components/main/DockContext';

export default function DockBar() {
	const { items } = useDock();

	if (items.length === 0) return null;

	return (
		<div className="pointer-events-auto fixed right-6 bottom-6 z-40 flex items-center gap-2">
			{items.map((item) => (
				<button
					key={item.id}
					type="button"
					className="flex items-center gap-2 rounded-full border border-[rgba(120,255,160,0.2)] bg-[rgba(6,12,6,0.7)] px-4 py-2 font-mono text-[rgba(150,255,190,0.75)] text-xs uppercase tracking-[0.2em] shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-105"
					onClick={item.onRestore}
				>
					<span className="inline-block h-2 w-2 rounded-full bg-[#27c93f]" />
					{item.label}
				</button>
			))}
		</div>
	);
}
