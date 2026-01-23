'use client';

import { Button } from '@mantine/core';
import {
	IconArrowLeft,
	IconBookUpload,
	IconList,
	IconPencil,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function GotoListButton() {
	const router = useRouter();

	return (
		<Button
			leftSection={<IconList />}
			onClick={() => {
				router.push('/posts');
			}}
		>
			목록 으로
		</Button>
	);
}
