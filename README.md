# Blog Client (Next.js)

Next.js(App Router) 기반의 블로그 클라이언트입니다.  
글 작성은 **MDXEditor**로 진행하며, 저장/이미지 업로드는 **별도 FastAPI 서버**로 요청합니다.  
(Next.js 내부 API 라우트는 사용하지 않습니다.)

---

## 🧩 기술 스택

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- MDXEditor (`@mdxeditor/editor`)
- pnpm

---

## 📁 폴더 구조 (이번 커밋 기준)

```text
app/
  post/
    page.tsx                 # 글 작성 페이지 (/post)
components/
  mdx/
    ForwardRefEditor.tsx     # MDXEditor SSR off wrapper (dynamic import)
    InitializedMDXEditor.tsx # MDXEditor 플러그인/툴바 구성 + 이미지 업로드 핸들러
.vscode/                     # (선택) 워크스페이스 설정
```

## 개발실행
```bash
pnpm dev
```

## ✅ 구현된 기능
1) 글 작성 페이지 /post
- 제목 입력 + MDXEditor 편집
- 저장 버튼 클릭 시 FastAPI 서버로 POST 요청
- draft/tags/author 등 메타 필드 포함(프로젝트 설정에 맞게 사용)

2) MDXEditor 기본 플러그인 구성
- 툴바 (Undo/Redo, Bold/Italic/Underline, Block type, List, Link, Image, Code block 등)
- 링크 다이얼로그
- 리스트(불릿/넘버/체크)
- 코드블록 + 언어 선택
- 마크다운 단축키 (``` 등)

3) ~~이미지 업로드~~
- ~~에디터에서 이미지 삽입 시 FastAPI 업로드 엔드포인트로 업로드 후 URL 반환~~
- ~~반환된 URL을 본문에 이미지로 삽입~~

## 🔧 환경 변수 설정

프로젝트 루트에 .env.local 생성:
```
# FastAPI 로컬 서버 주소
NEXT_PUBLIC_API_BASE_URL=http://localhost:8152
```

## ▶️ 실행 방법
1) 의존성 설치
```
pnpm install
```

2) 개발 서버 실행
```
pnpm dev
```

3) 접속
```
작성 페이지: http://localhost:3000/post
```