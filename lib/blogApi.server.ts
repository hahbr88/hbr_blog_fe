import 'server-only';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

// 너의 PostOut에 맞춰 최소 필드만 잡아둠(필드명은 FastAPI 응답에 맞춰 수정)
export type PostOut = {
	id: number;
	title: string;
	content: string; // ← 실제 응답이 content / body / mdx 등이라면 여기만 바꾸면 됨
	tags?: string[] | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export async function getPostById(postId: number): Promise<PostOut | null> {
	const res = await fetch(`${API_BASE}/api/v1/posts/${postId}`, {
		// ✅ ISR: 60초마다 재검증(원하면 조절)
		next: { revalidate: 60 },
	});

	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);

	return (await res.json()) as PostOut;
}
