'use client';

import { Button, Stack, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';

const Test = () => {
	const router = useRouter();
	return (
		<Stack p="lg">
			<Title order={2}>Mantine OK</Title>
			<Button onClick={() => router.push('/post')}>포스트작성</Button>
		</Stack>
	);
};

export default Test;
