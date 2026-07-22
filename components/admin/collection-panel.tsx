"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { RichTextEditor } from "./rich-text-editor"
import { MediaUpload } from "./media-upload"
import { MapPicker } from "./map-picker"
import { Plus, Trash2, Save, X, Edit3, Image as ImageIcon, ChevronUp } from "lucide-react"

export type CollectionField = {
  name: string
  label: string
  type?: "text" | "textarea" | "number" | "richtext" | "image" | "map_picker"
}

type SaveAction = (
  prev: unknown,
  formData: FormData,
) => Promise<{ ok?: boolean; savedAt?: number } | { error: string } | null>

type DeleteAction = (formData: FormData) => Promise<void>

type Item = Record<string, string | number | null | undefined>

function SaveButton({ label, isNew }: { label: string, isNew?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${
        isNew 
          ? "bg-primary text-white hover:bg-primary/90 shadow-primary/20" 
          : "bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 shadow-black/10"
      }`}
    >
      <Save className="h-4 w-4" />
      {pending ? "Đang xử lý..." : label}
    </button>
  )
}

function ItemForm({
  item,
  fields,
  saveAction,
  deleteAction,
  isNew,
  onSaved,
  onCancel,
  mapImage,
}: {
  item: Item
  fields: CollectionField[]
  saveAction: SaveAction
  deleteAction: DeleteAction
  isNew?: boolean
  onSaved?: () => void
  onCancel?: () => void
  mapImage?: string
}) {
  const [isExpanded, setIsExpanded] = useState(isNew ? true : false)
  
  const [state, formAction] = useActionState(async (prev: unknown, formData: FormData) => {
    const result = await saveAction(prev, formData)
    if (result && "ok" in result && result.ok) {
      if (isNew) onSaved?.()
      else setIsExpanded(false) // Auto collapse on successful edit save
    }
    return result
  }, null as Awaited<ReturnType<SaveAction>>)

  const displayTitle = String(item.title || item.caption || item.name || "Mục chưa có tên")
  const displayImage = String(item.image || "")
  const displayDesc = String(item.description || item.price || item.season || "")

  if (!isExpanded) {
    return (
      <div className="group relative overflow-hidden rounded-3xl border border-[#1A1A1A]/10 bg-white shadow-sm transition-all hover:shadow-md hover:border-[#1A1A1A]/20">
        <div className="flex items-center justify-between p-4 sm:p-5">
          <div className="flex items-center gap-4 min-w-0">
            {displayImage && displayImage !== "/placeholder.svg" ? (
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#1A1A1A]/10 bg-[#F9F8F6]">
                <img src={displayImage} alt="" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1A1A1A]/10 bg-[#F9F8F6] text-[#1A1A1A]/30">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-serif text-lg font-medium text-[#1A1A1A] truncate">{displayTitle}</h3>
              {displayDesc && (
                <p className="text-sm text-[#1A1A1A]/50 truncate mt-0.5">{displayDesc}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="shrink-0 ml-4 flex items-center gap-2 rounded-xl border border-[#1A1A1A]/10 bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-[#F9F8F6]"
          >
            <Edit3 className="h-4 w-4 text-[#1A1A1A]/60" />
            <span className="hidden sm:inline">Chỉnh sửa</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${isNew ? 'border-primary/30 bg-primary/5 shadow-xl shadow-primary/5' : 'border-[#1A1A1A]/20 bg-white shadow-lg'}`}>
      <div className="p-6 sm:p-8">
        
        {!isNew && (
          <div className="mb-6 flex items-center justify-between border-b border-[#1A1A1A]/5 pb-4">
            <h3 className="font-serif text-xl font-medium text-[#1A1A1A]">
              Đang chỉnh sửa: <span className="text-primary italic">{displayTitle}</span>
            </h3>
            <button 
              type="button" 
              onClick={() => setIsExpanded(false)}
              className="rounded-full p-2 text-[#1A1A1A]/40 transition-colors hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A]"
              title="Thu gọn"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-6">
          {!isNew ? <input type="hidden" name="id" defaultValue={String(item.id ?? "")} /> : null}
          
          <div className="grid gap-6 md:grid-cols-2">
            {fields.map((f) => (
              <div 
                key={f.name} 
                className={`flex flex-col gap-2 ${f.type === 'richtext' || f.type === 'textarea' || f.name === 'title' || f.type === 'map_picker' ? 'md:col-span-2' : 'col-span-1'}`}
              >
                <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/60">
                  {f.label}
                </label>
                
                {f.type === "richtext" ? (
                  <div className="overflow-hidden rounded-2xl border border-[#1A1A1A]/10 bg-white">
                    <RichTextEditor name={f.name} defaultValue={String(item[f.name] ?? "")} />
                  </div>
                ) : f.type === "map_picker" ? (
                  <MapPicker 
                    mapImage={mapImage || "/images/map.jpg"} 
                    defaultTop={item.mapTop ? Number(item.mapTop) : undefined} 
                    defaultLeft={item.mapLeft ? Number(item.mapLeft) : undefined} 
                  />
                ) : f.type === "image" || f.name === "image" ? (
                  <MediaUpload name={f.name} defaultValue={String(item[f.name] ?? "")} />
                ) : f.type === "textarea" ? (
                  <textarea
                    name={f.name}
                    defaultValue={String(item[f.name] ?? "")}
                    rows={3}
                    className="w-full rounded-2xl border border-[#1A1A1A]/10 bg-[#F9F8F6] px-5 py-3.5 text-sm text-[#1A1A1A] outline-none transition-colors focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/20"
                    placeholder={`Nhập ${f.label.toLowerCase()}...`}
                  />
                ) : (
                  <input
                    name={f.name}
                    type={f.type === "number" ? "number" : "text"}
                    defaultValue={String(item[f.name] ?? (f.type === "number" ? "0" : ""))}
                    className="w-full rounded-2xl border border-[#1A1A1A]/10 bg-[#F9F8F6] px-5 py-3.5 text-sm font-medium text-[#1A1A1A] outline-none transition-colors focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/20"
                    placeholder={`Nhập ${f.label.toLowerCase()}...`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#1A1A1A]/5 pt-6">
            <div className="flex items-center gap-3">
              <SaveButton label={isNew ? "Hoàn tất thêm mới" : "Lưu thay đổi"} isNew={isNew} />
              {(isNew && onCancel) ? (
                <button 
                  type="button" 
                  onClick={onCancel}
                  className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-[#1A1A1A]/60 transition-colors hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A]"
                >
                  <X className="h-4 w-4" /> Hủy
                </button>
              ) : null}
            </div>
            
            <div className="flex items-center gap-4">
              {state && "ok" in state && state.ok ? (
                <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  <CheckCircle2 className="h-3 w-3" /> Đã lưu thành công
                </span>
              ) : null}
              {state && "error" in state && state.error ? (
                <span className="flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                  {state.error}
                </span>
              ) : null}

              {!isNew && (
                <button
                  formAction={deleteAction}
                  className="group ml-auto flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="hidden sm:inline">Xóa</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function CheckCircle2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

export function CollectionPanel({
  items,
  fields,
  saveAction,
  deleteAction,
  labelSingular,
  mapImage,
}: {
  items: Item[]
  fields: CollectionField[]
  saveAction: SaveAction
  deleteAction: DeleteAction
  labelSingular: string
  mapImage?: string
}) {
  const [showNew, setShowNew] = useState(false)
  const emptyItem: Item = Object.fromEntries(fields.map((f) => [f.name, ""]))

  return (
    <div className="flex flex-col">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 rounded-3xl border border-[#1A1A1A]/5 bg-white p-6 shadow-xl shadow-black/[0.02]">
        <div>
          <h2 className="font-serif text-3xl font-medium text-[#1A1A1A] capitalize">
            Quản lý {labelSingular}
          </h2>
          <p className="mt-2 text-sm font-medium tracking-wide text-[#1A1A1A]/50">
            Có tổng cộng {items.length} {labelSingular} đang được hiển thị.
          </p>
        </div>
        {!showNew && (
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/30"
          >
            <Plus className="h-5 w-5" />
            Thêm {labelSingular} mới
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {showNew && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 mb-4">
            <ItemForm
              item={emptyItem}
              fields={fields}
              saveAction={saveAction}
              deleteAction={deleteAction}
              isNew
              onSaved={() => setShowNew(false)}
              onCancel={() => setShowNew(false)}
              mapImage={mapImage}
            />
          </div>
        )}

        <div className="grid gap-3 grid-cols-1">
          {items.map((item) => (
            <ItemForm
              key={String(item.id)}
              item={item}
              fields={fields}
              saveAction={saveAction}
              deleteAction={deleteAction}
              mapImage={mapImage}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
