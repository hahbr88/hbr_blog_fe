import { Button, Stack, Title } from '@mantine/core';
import Image from 'next/image';
import Test from '@/components/main/Test';
import Hero from '@/components/main/Hero';

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-0 font-sans dark:bg-black">
			<main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
				<Hero />
			</main>
		</div>
	);
}
