"use client";

import TextAlign from "@tiptap/extension-text-align";
import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import parse from "html-react-parser";

export function RenderDescription({ json }: { json: JSONContent }) {
  const output = () => {
    return generateHTML(json, [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ]);
  };

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output())}
    </div>
  );
}
