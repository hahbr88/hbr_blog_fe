'use client';

import { Button } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function HomeButton() {
	const router = useRouter();

	return (
		<Button
            
			onClick={() => {
				router.push('/');
			}}
		>
			<IconHome />
		</Button>
	);
}
