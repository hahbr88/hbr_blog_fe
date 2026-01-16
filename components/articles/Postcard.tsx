'use client'

import { Badge, Button, Card, Group, Image, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { use } from 'react';

const PostCard = ({
	id,
	img,
	thumbnail,
	thumbnailRatio = '16:9',
	title,
	tags,
	createdAt,
	description,
}: {
	id: number;
	img?: { src: string; height: number; alt: string };
	thumbnail?: string | null;
	thumbnailRatio?: '16:9' | '1:1';
	title: string;
	description: string;
	createdAt?: string | null;
	tags?: string[] | null;
}) => {
	const ratioClass =
		thumbnailRatio === '1:1' ? 'postcard-thumb-1x1' : 'postcard-thumb-16x9';

	return (
		<Card
			component={Link}
			href={`/posts/${id}`}
			withBorder
			radius="md"
			padding="lg"
			className="postcard-fixed postcard-wiggle transition hover:bg-slate-50"
		>
			{thumbnail ? (
				<Card.Section>
					<div className={`postcard-thumb ${ratioClass}`}>
						<img
							src={thumbnail}
							alt={title}
							className="postcard-thumb-image"
						/>
					</div>
				</Card.Section>
			) : null}

			<div className="postcard-body">
				<Title order={3} className="postcard-title font-semibold text-lg">
					{title}
				</Title>

				<Group gap="xs" mt="sm" wrap="wrap" className="postcard-meta">
					{createdAt ? (
						<Text size="xs" c="dimmed">
							{new Date(createdAt).toLocaleDateString('ko-KR')}
						</Text>
					) : null}

					{tags?.length ? (
						<div className="postcard-tags">
							<Text size="xs" c="dimmed">
								·
							</Text>

							{tags.map((t) => (
								<Badge key={t} variant="light" size="sm" radius="xl">
									#{t}
								</Badge>
							))}
						</div>
					) : null}
				</Group>
			</div>
		</Card>
	);
};

export default PostCard;
