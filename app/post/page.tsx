'use client';

import {
	Button,
	Input,
	Modal,
	TagsInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconArrowLeft,
	IconBookUpload,
	IconPencil,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ForwardRefEditor } from '@/components/mdx/ForwardRefEditor';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

export default function PostPage() {
	const router = useRouter();
	const initialMdxRef = useRef('');
	const [title, setTitle] = useState<string>('');
	const [tags, setTags] = useState<string[]>([]);
	const [mdx, setMdx] = useState<string>(initialMdxRef.current);
	const [opened, { open, close }] = useDisclosure(false);
	const [saving, setSaving] = useState<boolean>(false);

	const onClickPost = async () => {
		if (!ADMIN_TOKEN) {
			alert('NEXT_PUBLIC_ADMIN_TOKEN is not set!');
			return;
		}
		if (!API_BASE) {
			alert('NEXT_PUBLIC_API_BASE_URL is not set!');
			return;
		}

		setSaving(true);
		try {
			const res = await fetch(`${API_BASE}/api/v1/admin/posts`, {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'X-Admin-Token': ADMIN_TOKEN || '',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title, content: mdx, tags }),
			});

			if (!res.ok) {
				const txt = await res.text().catch(() => '');
				throw new Error(`Save failed (${res.status}): ${txt}`);
			}

			const data = await res.json().catch(() => ({}));
			router.push(`/posts/${data?.id ?? ''}`);
		} catch (e: any) {
			alert(e?.message ?? 'Error');
		} finally {
			setSaving(false);
		}
	};

	const onClickTempPost = async () => {
		if (!ADMIN_TOKEN) {
			alert('NEXT_PUBLIC_ADMIN_TOKEN is not set!');
			return;
		}
		if (!API_BASE) {
			alert('NEXT_PUBLIC_API_BASE_URL is not set!');
			return;
		}

		setSaving(true);
		try {
			const res = await fetch(`${API_BASE}/api/v1/admin/posts/temp`, {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'X-Admin-Token': ADMIN_TOKEN || '',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title, content: mdx, tags }),
			});
			if (!res.ok) {
				const txt = await res.text().catch(() => '');
				throw new Error(`Save failed (${res.status}): ${txt}`);
			}
		} catch (e: any) {
			alert(e?.message ?? 'Error');
		} finally {
			setSaving(false);
		}
	};

	return (
		<main className="mx-auto max-w-4xl p-6">
			<div className="mb-4 flex items-center justify-between">
				<h1 className="font-semibold text-xl">새 포스트 작성</h1>
				<div className="flex gap-2">
					<Modal
						opened={opened}
						onClose={close}
						title="포스트를 발행하시겠습니까?"
						radius={5}
						transitionProps={{ transition: 'fade', duration: 200 }}
					>
						<Button.Group className="flex justify-end gap-1">
							<Button color="red" onClick={close}>
								취소
							</Button>
							<Button variant="default" onClick={onClickPost} loading={saving}>
								발행
							</Button>
						</Button.Group>
					</Modal>
					<Button.Group className="flex justify-end gap-1">
						<Button onClick={() => router.push('/')} color="red">
							<IconArrowLeft />
						</Button>
						<Button
							onClick={onClickTempPost}
							disabled={saving || !title.trim()}
							loading={saving}
							color="blue"
						>
							<IconPencil />
						</Button>
						<Button
							onClick={open}
							disabled={saving || !title.trim()}
							loading={saving}
						>
							<IconBookUpload />
						</Button>
					</Button.Group>
				</div>
			</div>
			<Input.Wrapper label="제목" className="mb-2">
				<Input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="제목을 입력"
				/>
			</Input.Wrapper>

			<TagsInput
				className="mb-4"
				label="태그를 입력해주세요"
				placeholder="Enter tag"
				value={tags}
				onChange={setTags}
			/>

			<div>
				<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
					<ForwardRefEditor
						markdown={initialMdxRef.current}
						placeholder="내용을 입력"
						onChange={setMdx}
						className="min-h-130"
						// 에디터 내용 영역에 tailwind prose 적용 (typography 플러그인 추천)
						contentEditableClassName="prose prose-slate max-w-none p-4 focus:outline-none"
					/>
				</div>
			</div>
		</main>
	);
}
