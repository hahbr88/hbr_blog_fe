'use client';

import { Button, Container, Overlay, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React from 'react';

type HeroProps = {
	title?: string;
	subtitle?: string;
	imageSrc?: string;
	ctaLabel?: string;
	ctaHref?: string;
	className?: string;
};

export default function Hero({
	title = 'Welcome to Next.js',
	subtitle = 'A basic Hero component in TypeScript + Next.js',
	imageSrc,
	ctaLabel = 'Get Started',
	ctaHref = '/',
	className = '',
}: HeroProps) {
	const router = useRouter();

	const onClickPost = () => {
		router.push('/post');
	};
	return (
		<section
			className="relative bg-center bg-cover"
			style={{
				backgroundImage:
					'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)',
			}}
		>
			<Overlay
				gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
				opacity={1}
				zIndex={0}
			/>

			<Container
				size="md"
				className="relative z-[1] flex h-[700px] flex-col items-start justify-end pb-24 sm:h-[500px] sm:pb-12"
			>
				<Title
					c={'white'}
					className="font-medium text-[60px] leading-[1.1] max-[420px]:text-[28px] max-[420px]:leading-[1.3] sm:text-[40px] sm:leading-[1.2]"
				>
					{title}
				</Title>

				<Text
					c={'white'}
					className="mt-6 max-w-[600px]text-xl sm:max-w-full sm:text-sm"
				>
					{subtitle}
				</Text>

				<Button
					onClick={onClickPost}
					variant="gradient"
					size="xl"
					radius="xl"
					className="mt-6 sm:w-full"
				>
					Get started
				</Button>
			</Container>
		</section>
	);
}
