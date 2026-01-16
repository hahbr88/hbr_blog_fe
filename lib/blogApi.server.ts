import 'server-only';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

if (!API_BASE) {
	throw new Error('API_BASE_URL (or NEXT_PUBLIC_API_BASE_URL) is not set');
}

// 너의 PostOut에 맞춰 최소 필드만 잡아둠(필드명은 FastAPI 응답에 맞춰 수정)
export type PostOut = {
	id: number;
	title: string;
	content: string; // ← 실제 응답이 content / body / mdx 등이라면 여기만 바꾸면 됨
	tags?: string[] | null;
	thumbnail?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export async function listPosts(params?: {
	q?: string;
	skip?: number;
	limit?: number;
}): Promise<PostOut[]> {
	const url = new URL(`${API_BASE}/api/v1/posts`);
	if (params?.q) url.searchParams.set('q', params.q);
	if (typeof params?.skip === 'number')
		url.searchParams.set('skip', String(params.skip));
	if (typeof params?.limit === 'number')
		url.searchParams.set('limit', String(params.limit));

	const res = await fetch(url.toString(), {
		// ISR 원하면 next: { revalidate: 60 }
		next: { revalidate: 60 },
	});

	if (!res.ok) {
		const txt = await res.text().catch(() => '');
		throw new Error(`listPosts failed (${res.status}): ${txt}`);
	}

	return (await res.json()) as PostOut[];
}

export async function getPostById(postId: number): Promise<PostOut | null> {
	const res = await fetch(`${API_BASE}/api/v1/posts/${postId}`, {
		// ✅ ISR: 60초마다 재검증(원하면 조절)
		next: { revalidate: 60 },
	});

	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);

	return (await res.json()) as PostOut;
}
