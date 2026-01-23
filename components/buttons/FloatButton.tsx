'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import type { ReactNode } from 'react';

type FloatButtonProps = {
	icon: ReactNode;
	label?: string;
	onClick?: () => void;
	position?: {
		top?: number;
		right?: number;
		bottom?: number;
		left?: number;
	};
};

export default function FloatButton({
	icon,
	label = 'action',
	onClick,
	position = { bottom: 24, right: 24 },
}: FloatButtonProps) {
	const style: React.CSSProperties = {
		position: 'fixed',
		zIndex: 40,
		...position,
	};

	return (
		<Tooltip label={label} withArrow>
			<ActionIcon
				aria-label={label}
				onClick={onClick}
				size={48}
				radius="xl"
				style={style}
				className="border border-[rgba(120,255,160,0.25)] bg-[rgba(6,12,6,0.7)] text-[rgba(160,255,200,0.9)] shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition hover:scale-105 hover:border-[rgba(120,255,160,0.55)]"
			>
				{icon}
			</ActionIcon>
		</Tooltip>
	);
}
