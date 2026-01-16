import { SimpleGrid } from '@mantine/core';
import PostCard from '@/components/articles/Postcard';
import PostPagination from '@/components/articles/PostPagination';
import { listPosts } from '@/lib/blogApi.server';

export const revalidate = 60;

const PAGE_SIZE = 12;

export default async function PostsPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; page?: string }>;
}) {
	const { q, page } = await searchParams;
	const currentPage = Math.max(1, Number(page ?? '1') || 1);

	const posts = await listPosts({
		q,
		limit: PAGE_SIZE,
		skip: (currentPage - 1) * PAGE_SIZE,
	});
	const totalPages = currentPage + (posts.length === PAGE_SIZE ? 1 : 0);

	return (
		<main className="mx-auto max-w-5xl px-6 py-10">
			<header className="mb-8">
				<h1 className="font-bold text-3xl tracking-tight">Posts</h1>
				{q ? <p className="mt-2 text-slate-500 text-sm">검색어: {q}</p> : null}
			</header>

			<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
				{posts.map((p) => (
					<PostCard
						key={`post-${p.id}-${p.title.slice(0, 3)}`}
						id={p.id}
						thumbnail={p.thumbnail}
						thumbnailRatio="16:9"
						title={p.title}
						createdAt={p.created_at}
						description={p.content}
						tags={p.tags}
					/>
				))}
			</SimpleGrid>

			{posts.length === 0 ? (
				<p className="mt-10 text-center text-slate-500 text-sm">
					포스트가 없습니다.
				</p>
			) : (
				<div className="mt-10 flex justify-center">
					<PostPagination page={currentPage} total={totalPages} />
				</div>
			)}
		</main>
	);
}
