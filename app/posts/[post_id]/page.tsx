import { CodeHighlight, InlineCodeHighlight } from '@mantine/code-highlight';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostById } from '@/lib/blogApi.server';

export const revalidate = 60;

function toInt(value: string): number | null {
	// "123"만 허용
	if (!/^\d+$/.test(value)) return null;
	const n = Number(value);
	if (!Number.isSafeInteger(n)) return null;
	return n;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ post_id: string }>;
}): Promise<Metadata> {
	const { post_id } = await params;
	const id = toInt(post_id);
	if (id === null) return { title: 'Post not found' };

	const post = await getPostById(id);
	if (!post) return { title: 'Post not found' };

	const description = post.content?.replace(/\s+/g, ' ').slice(0, 160) ?? '';

	return {
		title: post.title,
		description,
		openGraph: {
			title: post.title,
			description,
			type: 'article',
		},
	};
}

export default async function PostDetailPage({
	params,
}: {
	params: Promise<{ post_id: string }>;
}) {
	const { post_id } = await params;
	const id = toInt(post_id);
	if (id === null) notFound();

	const post = await getPostById(id);
	if (!post) notFound();

	return (
		<main className="mx-auto max-w-3xl px-6 py-10">
			<header className="mb-8">
				<h1 className="font-bold text-3xl tracking-tight">{post.title}</h1>

				<div className="mt-3 flex flex-wrap items-center gap-2 text-slate-500 text-sm">
					{/* {post.author ? <span>{post.author}</span> : null} */}
					{post.created_at ? (
						<span>· {new Date(post.created_at).toLocaleDateString()}</span>
					) : null}

					{post.tags?.length ? (
						<>
							<span>·</span>
							<ul className="flex flex-wrap gap-2">
								{post.tags.map((t) => (
									<li
										key={t}
										className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700"
									>
										#{t}
									</li>
								))}
							</ul>
						</>
					) : null}
				</div>
			</header>

			{/* ✅ MDXEditor로 작성된 텍스트를 “Markdown 렌더링”으로 우선 처리(안전/간단) */}
			<article
			>
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					components={{
						// ✅ 블록 코드: <pre><code ...>...</code></pre> 형태로 들어오므로 pre에서 뽑아 처리
						pre({ children }) {
							const first = React.Children.toArray(children)[0];

							if (!React.isValidElement(first)) return <pre>{children}</pre>;

							const className = (first.props as any).className ?? '';
							const match = /language-([\w-]+)/.exec(className);
							const language = match?.[1] ?? 'txt';
							const code = String((first.props as any).children ?? '').replace(
								/\n$/,
								'',
							);

							return (
								<CodeHighlight code={code} language={language} radius="md" />
							);
						},

						// ✅ 인라인 코드: 문장 중 `like this`
						code({ children }) {
							const code = String(children ?? '').replace(/\n$/, '');
							return <InlineCodeHighlight code={code} language="txt" />;
						},
					}}
				>
					{post.content}
				</ReactMarkdown>
			</article>
		</main>
	);
}
