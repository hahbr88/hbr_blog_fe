"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ForwardRefEditor } from "@/components/mdx/ForwardRefEditor";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

export default function PostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [mdx, setMdx] = useState<string>("# 새 글\n\n내용을 작성하세요.\n");
  const [saving, setSaving] = useState(false);

  const initial = useMemo(() => mdx, []); // MDXEditor의 markdown prop은 “초기값(defaultValue)” 성격이라 한 번만 넣는 게 안전

  const onSave = async () => {
    if (!ADMIN_TOKEN) {
      alert("NEXT_PUBLIC_ADMIN_TOKEN is not set!");
      return;
    }
    if (!API_BASE) {
      alert("NEXT_PUBLIC_API_BASE_URL is not set!");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/posts`, {
        method: "POST",
        headers: { 
            accept: 'application/json',
            "X-Admin-Token": ADMIN_TOKEN || "",
            "Content-Type": "application/json"
         },
        // FastAPI 스키마에 맞춰 key 이름 변경해도 됨
        body: JSON.stringify({ title, content: mdx }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Save failed (${res.status}): ${txt}`);
      }

      const data = await res.json().catch(() => ({}));
      console.log("Saved post:", data);
      alert(`Saved! ${data?.slug ?? ""}`);
    } catch (e: any) {
      alert(e?.message ?? "Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">새 포스트 작성</h1>
        <button
          onClick={onSave}
          disabled={saving || !title.trim()}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "발행 중..." : "발행"}
        </button>
      </div>

      <label className="mb-2 block text-sm font-medium text-slate-700">
        제목
      </label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        placeholder="제목을 입력"
      />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <ForwardRefEditor
          markdown={initial}
          onChange={setMdx}
          className="min-h-[520px]"
          // 에디터 내용 영역에 tailwind prose 적용 (typography 플러그인 추천)
          contentEditableClassName="prose prose-slate max-w-none p-4 focus:outline-none"
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        * 에디터 툴바/다이얼로그 UI는 MDXEditor 기본 CSS를 사용하고, 본문 스타일은 Tailwind
        prose로 잡는 방식입니다.
      </p>
    </main>
  );
}
