"use client"

import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import "react-quill-new/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

export function RichTextEditor({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue)

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  )

  return (
    <div className="rounded-2xl border border-border bg-background text-foreground overflow-hidden focus-within:border-accent transition-colors">
      <input type="hidden" name={name} value={value} />
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        className="[&_.ql-toolbar]:!border-x-0 [&_.ql-toolbar]:!border-t-0 [&_.ql-toolbar]:!border-b-border [&_.ql-container]:!border-none [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-base [&_.ql-editor]:font-sans [&_.ql-stroke]:stroke-foreground [&_.ql-fill]:fill-foreground [&_.ql-picker-label]:text-foreground [&_.ql-editor_img]:max-w-full [&_.ql-editor_img]:h-auto [&_.ql-editor_img]:rounded-xl [&_.ql-editor_img]:my-4"
      />
    </div>
  )
}
