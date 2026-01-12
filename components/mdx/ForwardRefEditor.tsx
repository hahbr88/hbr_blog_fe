"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";
import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";

// InitializedMDXEditor를 직접 import하는 곳은 여기 한 군데만!
const Editor = dynamic(() => import("./InitializedMDXEditor"), { ssr: false });

export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => <Editor {...props} editorRef={ref} />
);

ForwardRefEditor.displayName = "ForwardRefEditor";
