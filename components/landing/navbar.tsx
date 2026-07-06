"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"

const links = [
  { href: "/#gioi-thieu", label: "Giới thiệu" },
  { href: "/#dia-diem", label: "Địa điểm" },
  { href: "/#tours", label: "Tour" },
  { href: "/#am-thuc", label: "Ẩm thực" },
  { href: "/#products", label: "Sản phẩm" },
  { href: "/#van-hoa", label: "Văn hóa" },
  { href: "/#lien-he", label: "Liên hệ" },
]

export function Navbar() {
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full border px-5 py-2.5 transition-all duration-500 ${
          scrolled
            ? "border-border bg-background/90 shadow-lg shadow-primary/5 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <a href="/" className="flex items-center gap-2">
          <div className="relative size-10 overflow-hidden rounded-full bg-white shadow-sm transition-transform hover:scale-105">
            <Image 
              src="/logo.png" 
              alt="Trà Vinh Logo" 
              fill
              className="object-contain p-0.5" 
            />
          </div>
          <span className={`hidden sm:inline-block font-serif text-lg font-semibold tracking-tight transition-colors ${
            scrolled ? "text-foreground" : "text-primary-foreground"
          }`}>
            Trà Vinh
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground ${
                scrolled ? "text-muted-foreground" : "text-primary-foreground/90"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {session ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-sm font-medium text-foreground">{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <a
              href="/dang-nhap"
              className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105 md:inline-block"
            >
              Đăng nhập
            </a>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className={`grid size-9 place-items-center rounded-full border transition-colors md:hidden ${
              scrolled
                ? "border-border bg-background/70 text-foreground"
                : "border-primary-foreground/20 bg-transparent text-primary-foreground"
            }`}
            aria-label={open ? "Đóng menu" : "Mở menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-x-4 top-20 z-50 rounded-3xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
