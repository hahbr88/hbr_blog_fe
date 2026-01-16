// components/mdx/InitializedMDXEditor.tsx
'use client';

import type { ForwardedRef } from 'react';
import '@mdxeditor/editor/style.css';

import {
	BlockTypeSelect,
	BoldItalicUnderlineToggles,
	ChangeCodeMirrorLanguage,
	CodeToggle,
	ConditionalContents,
	CreateLink,
	codeBlockPlugin,
	codeMirrorPlugin,
	// plugins
	headingsPlugin,
	InsertCodeBlock,
	InsertImage,
	InsertThematicBreak,
	imagePlugin,
	ListsToggle,
	linkDialogPlugin,
	linkPlugin,
	listsPlugin,
	MDXEditor,
	type MDXEditorMethods,
	type MDXEditorProps,
	markdownShortcutPlugin,
	quotePlugin,
	Separator,
	thematicBreakPlugin,
	toolbarPlugin,
	// toolbar components / primitives
	UndoRedo,
} from '@mdxeditor/editor';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

async function imageUploadHandler(image: File) {
	if (!API_BASE) throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');

	const formData = new FormData();
	formData.append('image', image);

	const res = await fetch(`${API_BASE}/api/v1/uploads/images`, {
		method: 'POST',
		headers: ADMIN_TOKEN ? { 'X-Admin-Token': ADMIN_TOKEN } : undefined,
		body: formData,
	});

	if (!res.ok) {
		const txt = await res.text().catch(() => '');
		throw new Error(`Image upload failed (${res.status}): ${txt}`);
	}
	const data = (await res.json()) as { url: string };
	return data.url;
}

export default function InitializedMDXEditor(
	props: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps,
) {
	const { editorRef, ...rest } = props;

	return (
		<MDXEditor
			{...rest}
			ref={editorRef}
			plugins={[
				// 기본 문서 구조/단축키
				headingsPlugin(),
				listsPlugin(),
				quotePlugin(),
				thematicBreakPlugin(),
				markdownShortcutPlugin(), // ``` 등 마크다운 단축 입력 :contentReference[oaicite:2]{index=2}

				// 링크 + Ctrl/Cmd+K 팝오버 :contentReference[oaicite:3]{index=3}
				linkPlugin(),
				linkDialogPlugin(),

				// 이미지(붙여넣기/드래그드랍 업로드 핸들러) :contentReference[oaicite:4]{index=4}
				imagePlugin({
					imageUploadHandler,
					imageAutocompleteSuggestions: [],
				}),

				// 코드블록 + CodeMirror(언어 선택/하이라이트) :contentReference[oaicite:5]{index=5}
				codeBlockPlugin({ defaultCodeBlockLanguage: 'ts' }),
				codeMirrorPlugin({
					codeBlockLanguages: {
						ts: 'TypeScript',
						tsx: 'TypeScript (React)',
						js: 'JavaScript',
						json: 'JSON',
						py: 'Python',
						bash: 'Bash',
						yaml: 'YAML',
					},
				}),

				// 툴바(필요한 버튼들 구성) :contentReference[oaicite:6]{index=6}
				toolbarPlugin({
					toolbarClassName:
						'sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-t-lg border-b border-slate-200 bg-white/95 p-2 backdrop-blur',
					toolbarContents: () => (
						<>
							<UndoRedo />
							<Separator />
							<BoldItalicUnderlineToggles />
							<CodeToggle />
							<Separator />
							<BlockTypeSelect />
							<Separator />
							<ListsToggle options={['bullet', 'number', 'check']} />
							<Separator />
							<CreateLink />
							<InsertImage />
							<Separator />
							{/* 코드블록에 포커스면 언어 선택 드롭다운을 보여주고, 아니면 InsertCodeBlock 버튼 */}
							<ConditionalContents
								options={[
									{
										when: (editor) => editor?.editorType === 'codeblock',
										contents: () => <ChangeCodeMirrorLanguage />,
									},
									{
										fallback: () => (
											<>
												<InsertCodeBlock />
												<InsertThematicBreak />
											</>
										),
									},
								]}
							/>
						</>
					),
				}),
			]}
		/>
	);
}
