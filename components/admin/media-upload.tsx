"use client"

import { useState } from "react"
import { Loader2, Upload, Link as LinkIcon } from "lucide-react"

export function MediaUpload({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue || "")
  const [isUploading, setIsUploading] = useState(false)
  const [mode, setMode] = useState<"url" | "upload">("upload")

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    try {
      const { getCloudinarySignatureAction } = await import("@/app/admin/actions")
      const { timestamp, signature, apiKey, cloudName } = await getCloudinarySignatureAction()

      const resourceType = file.type.startsWith("video/") ? "video" : "image"
      
      const CHUNK_SIZE = 20 * 1024 * 1024; // 20MB per chunk
      const uniqueUploadId = Math.random().toString(36).substring(2) + Date.now().toString(36)
      const totalSize = file.size
      let secureUrl = ""

      for (let start = 0; start < totalSize; start += CHUNK_SIZE) {
        const end = Math.min(start + CHUNK_SIZE - 1, totalSize - 1)
        const chunk = file.slice(start, end + 1)
        
        const formData = new FormData()
        formData.append("file", chunk, file.name)
        formData.append("api_key", apiKey)
        formData.append("timestamp", String(timestamp))
        formData.append("signature", signature)

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
          method: "POST",
          headers: {
            "X-Unique-Upload-Id": uniqueUploadId,
            "Content-Range": `bytes ${start}-${end}/${totalSize}`,
          },
          body: formData,
        })
        
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error?.message || "Lỗi khi tải lên (Chunk " + start + ")")
        }
        
        if (data.secure_url) {
          secureUrl = data.secure_url
        }
      }

      if (secureUrl) {
        setValue(secureUrl)
      } else {
        alert("Upload thất bại: Lỗi không xác định")
      }
    } catch (err: any) {
      alert("Lỗi cấu hình hoặc upload: " + (err.message || "Vui lòng kiểm tra console."))
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-1 w-fit">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === "upload" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="size-3.5" /> Up từ máy
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === "url" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LinkIcon className="size-3.5" /> Dùng URL
        </button>
      </div>

      {mode === "upload" ? (
        <div className="flex items-center gap-4 w-full">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background px-4 py-8 text-sm text-muted-foreground transition-colors hover:border-accent flex-1 hover:bg-muted/30 w-full overflow-hidden">
            {isUploading ? (
              <Loader2 className="size-5 animate-spin text-accent" />
            ) : (
              <Upload className="size-5" />
            )}
            {isUploading ? "Đang tải lên..." : "Bấm để chọn file (Ảnh / Video)"}
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Nhập đường dẫn ảnh hoặc video (VD: https://...)"
          className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
        />
      )}

      {/* Input ẩn để truyền dữ liệu vào formData */}
      <input type="hidden" name={name} value={value} />

      {value && mode === "upload" && (
        <div className="flex items-center gap-2 mt-2 rounded-xl border border-border bg-background p-2 pr-4 text-xs w-full overflow-hidden">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0 overflow-hidden relative">
            {(value.match(/\.(mp4|webm|ogg)$/i) || value.includes("video/upload")) ? (
              <video src={value} className="size-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="Preview" className="size-full object-cover" />
            )}
          </div>
          <span className="truncate flex-1 font-medium min-w-0">{value}</span>
          <button type="button" onClick={() => setValue("")} className="text-destructive hover:underline ml-2 shrink-0">Xóa</button>
        </div>
      )}
    </div>
  )
}
