"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { saveSiteContentAction } from "@/app/admin/actions"
import type { SiteContent } from "@/lib/default-content"
import { MediaUpload } from "./media-upload"
import { Save, CheckCircle2 } from "lucide-react"

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
      className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all active:scale-95 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/30 disabled:opacity-60 disabled:pointer-events-none"
    >
      <Save className="h-5 w-5" />
      {pending ? "Đang lưu cấu hình..." : "Lưu tất cả thay đổi"}
    </button>
  )
}

export function SiteContentPanel({ content }: { content: SiteContent }) {
  const [state, formAction] = useActionState(
    saveSiteContentAction,
    null as { ok?: boolean; savedAt?: number } | null,
  )

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
        {fields.map((f) => (
          <div
            key={f.name}
            className={`flex flex-col gap-2 ${f.type === "textarea" ? "md:col-span-2" : "col-span-1"}`}
          >
            <label htmlFor={f.name} className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/60">
              {f.label}
            </label>
            {f.type === "image" ? (
              <div className="rounded-2xl border border-[#1A1A1A]/10 p-2">
                <MediaUpload name={f.name} defaultValue={content[f.name]} />
              </div>
            ) : f.type === "textarea" ? (
              <textarea
                id={f.name}
                name={f.name}
                defaultValue={content[f.name]}
                rows={4}
                className="w-full rounded-2xl border border-[#1A1A1A]/10 bg-[#F9F8F6] px-5 py-4 text-sm leading-relaxed text-[#1A1A1A] outline-none transition-colors focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/20"
                placeholder={`Nhập ${f.label.toLowerCase()}...`}
              />
            ) : (
              <input
                id={f.name}
                name={f.name}
                defaultValue={content[f.name]}
                className="w-full rounded-2xl border border-[#1A1A1A]/10 bg-[#F9F8F6] px-5 py-3.5 text-sm font-medium text-[#1A1A1A] outline-none transition-colors focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/20"
                placeholder={`Nhập ${f.label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#1A1A1A]/5 pt-8">
        <SaveButton />
        {state?.ok ? (
          <span className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 shadow-sm">
            <CheckCircle2 className="h-4 w-4" /> Đã lưu thành công
          </span>
        ) : null}
      </div>
    </form>
  )
}
