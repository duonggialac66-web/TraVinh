"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { RichTextEditor } from "./rich-text-editor"
import { MediaUpload } from "./media-upload"

export type CollectionField = {
  name: string
  label: string
  type?: "text" | "textarea" | "number" | "richtext" | "image"
}

type SaveAction = (
  prev: unknown,
  formData: FormData,
) => Promise<{ ok?: boolean; savedAt?: number } | { error: string } | null>

type DeleteAction = (formData: FormData) => Promise<void>

type Item = Record<string, string | number>

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Đang lưu..." : label}
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
}: {
  item: Item
  fields: CollectionField[]
  saveAction: SaveAction
  deleteAction: DeleteAction
  isNew?: boolean
  onSaved?: () => void
}) {
  const [state, formAction] = useActionState(async (prev: unknown, formData: FormData) => {
    const result = await saveAction(prev, formData)
    if (result && "ok" in result && result.ok) onSaved?.()
    return result
  }, null as Awaited<ReturnType<SaveAction>>)

  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <form action={formAction} className="grid gap-4">
        {!isNew ? <input type="hidden" name="id" defaultValue={String(item.id ?? "")} /> : null}
        {fields.map((f) => (
          <div key={f.name} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {f.label}
            </label>
            {f.type === "richtext" ? (
              <RichTextEditor name={f.name} defaultValue={String(item[f.name] ?? "")} />
            ) : f.type === "image" || f.name === "image" ? (
              <MediaUpload name={f.name} defaultValue={String(item[f.name] ?? "")} />
            ) : f.type === "textarea" ? (
              <textarea
                name={f.name}
                defaultValue={String(item[f.name] ?? "")}
                rows={2}
                className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
            ) : (
              <input
                name={f.name}
                type={f.type === "number" ? "number" : "text"}
                defaultValue={String(item[f.name] ?? (f.type === "number" ? "0" : ""))}
                className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
            )}
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-3">
          <SaveButton label={isNew ? "Thêm mới" : "Lưu"} />
          {state && "ok" in state && state.ok ? (
            <span className="text-sm text-primary">Đã lưu.</span>
          ) : null}
          {state && "error" in state && state.error ? (
            <span className="text-sm text-destructive">{state.error}</span>
          ) : null}
        </div>
      </form>

      {!isNew ? (
        <form
          action={deleteAction}
          className="mt-3 border-t border-border pt-3"
        >
          <input type="hidden" name="id" defaultValue={String(item.id ?? "")} />
          <button
            type="submit"
            className="text-sm text-destructive transition-colors hover:underline"
          >
            Xóa mục này
          </button>
        </form>
      ) : null}
    </div>
  )
}

export function CollectionPanel({
  items,
  fields,
  saveAction,
  deleteAction,
  labelSingular,
}: {
  items: Item[]
  fields: CollectionField[]
  saveAction: SaveAction
  deleteAction: DeleteAction
  labelSingular: string
}) {
  const [showNew, setShowNew] = useState(false)
  const emptyItem: Item = Object.fromEntries(fields.map((f) => [f.name, ""]))

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-8 grid-cols-1">
        {items.map((item) => (
          <ItemForm
            key={String(item.id)}
            item={item}
            fields={fields}
            saveAction={saveAction}
            deleteAction={deleteAction}
          />
        ))}
      </div>

      {showNew ? (
        <div className="rounded-3xl border-2 border-dashed border-accent/40 p-1">
          <ItemForm
            item={emptyItem}
            fields={fields}
            saveAction={saveAction}
            deleteAction={deleteAction}
            isNew
            onSaved={() => setShowNew(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="self-start rounded-full border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:border-accent"
        >
          + Thêm {labelSingular}
        </button>
      )}
    </div>
  )
}
