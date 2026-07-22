"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { MapPin } from "lucide-react"

export function MapPicker({ 
  mapImage, 
  defaultTop, 
  defaultLeft 
}: { 
  mapImage: string
  defaultTop?: number
  defaultLeft?: number
}) {
  const [top, setTop] = useState<number | undefined>(defaultTop)
  const [left, setLeft] = useState<number | undefined>(defaultLeft)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Calculate percentage
    const percentX = (x / rect.width) * 100
    const percentY = (y / rect.height) * 100
    
    setLeft(Number(percentX.toFixed(2)))
    setTop(Number(percentY.toFixed(2)))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 mb-2 text-sm text-[#1A1A1A]/70">
        <p>Bấm trực tiếp vào bản đồ để chọn vị trí ghim.</p>
        {(top !== undefined && left !== undefined) && (
          <div className="flex items-center gap-2 font-mono bg-[#F9F8F6] px-3 py-1 rounded-lg">
            <span>X: {left}%</span>
            <span>Y: {top}%</span>
            <button 
              type="button" 
              onClick={() => { setTop(undefined); setLeft(undefined); }}
              className="ml-2 text-red-500 hover:underline"
            >
              Xóa
            </button>
          </div>
        )}
      </div>

      <input type="hidden" name="mapTop" value={top ?? ""} />
      <input type="hidden" name="mapLeft" value={left ?? ""} />

      <div 
        ref={containerRef}
        onClick={handleMapClick}
        className="relative w-full bg-[#F9F8F6] rounded-2xl border border-[#1A1A1A]/10 overflow-hidden cursor-crosshair hover:border-primary/50 transition-colors"
      >
        {/* Dùng img chuẩn để container tự khớp aspect ratio thật của ảnh, không bị letterbox */}
        <img
          src={mapImage}
          alt="Bản đồ"
          className="w-full h-auto pointer-events-none"
        />
        
        {top !== undefined && left !== undefined && (
          <div 
            className="absolute flex items-center justify-center text-primary"
            style={{ 
              top: `${top}%`, 
              left: `${left}%`,
              transform: "translate(-50%, -100%)" // Pin points to the bottom center
            }}
          >
            <MapPin className="w-8 h-8 drop-shadow-md fill-primary/20" />
            <div className="absolute w-3 h-3 bg-primary rounded-full bottom-0 translate-y-1.5 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  )
}
