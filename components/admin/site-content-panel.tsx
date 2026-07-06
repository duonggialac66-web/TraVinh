"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { saveSiteContentAction } from "@/app/admin/actions"
import type { SiteContent } from "@/lib/default-content"
import { MediaUpload } from "./media-upload"

type FieldDef = {
  name: keyof SiteContent
  label: string
  type?: "text" | "textarea" | "image"
}

const fields: FieldDef[] = [
  { name: "logoImage", label: "Logo Website (Ảnh)", type: "image" },
  { name: "heroKicker", label: "Hero · Dòng nhỏ phía trên" },
  { name: "heroTitle", label: "Hero · Tiêu đề lớn" },
  { name: "heroSubtitle", label: "Hero · Mô tả", type: "textarea" },
  { name: "heroImage", label: "Hero · Đường dẫn ảnh/video nền", type: "image" },
  { name: "aboutHeading", label: "Giới thiệu · Tiêu đề" },
  { name: "aboutBody", label: "Giới thiệu · Nội dung", type: "textarea" },
  { name: "contactHeading", label: "Liên hệ · Tiêu đề" },
  { name: "contactBody", label: "Liên hệ · Nội dung", type: "textarea" },
  { name: "contactEmail", label: "Liên hệ · Email" },
  { name: "contactPhone", label: "Liên hệ · Điện thoại" },
  { name: "mapEmbedUrl", label: "Liên hệ · URL bản đồ nhúng", type: "textarea" },
]

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Đang lưu..." : "Lưu nội dung chung"}
    </button>
  )
}

export function SiteContentPanel({ content }: { content: SiteContent }) {
  const [state, formAction] = useActionState(
    saveSiteContentAction,
    null as { ok?: boolean; savedAt?: number } | null,
  )

  return (
    <form action={formAction} className="grid gap-5 md:grid-cols-2">
      {fields.map((f) => (
        <div
          key={f.name}
          className={`flex flex-col gap-2 ${f.type === "textarea" ? "md:col-span-2" : ""}`}
        >
          <label htmlFor={f.name} className="text-sm font-medium text-foreground">
            {f.label}
          </label>
          {f.type === "image" ? (
            <MediaUpload name={f.name} defaultValue={content[f.name]} />
          ) : f.type === "textarea" ? (
            <textarea
              id={f.name}
              name={f.name}
              defaultValue={content[f.name]}
              rows={3}
              className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
            />
          ) : (
            <input
              id={f.name}
              name={f.name}
              defaultValue={content[f.name]}
              className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
            />
          )}
        </div>
      ))}
      <div className="flex items-center gap-4 md:col-span-2">
        <SaveButton />
        {state?.ok ? <span className="text-sm text-primary">Đã lưu thành công.</span> : null}
      </div>
    </form>
  )
}
