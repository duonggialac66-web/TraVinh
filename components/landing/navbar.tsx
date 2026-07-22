"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X, ShoppingBag, User as UserIcon } from "lucide-react"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { useCartStore } from "@/store/cart"

const links = [
  { href: "/#gioi-thieu", label: "Giới thiệu" },
  { href: "/#dia-diem", label: "Địa điểm" },
  { href: "/#tours", label: "Tour" },
  { href: "/#am-thuc", label: "Ẩm thực" },
  { href: "/#products", label: "Sản phẩm" },
  { href: "/#van-hoa", label: "Văn hóa" },
]

export function Navbar() {
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isHome, setIsHome] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  
  const { carts, activeUser, setActiveUser, setIsOpen: setCartOpen } = useCartStore()

  useEffect(() => {
    setMounted(true)
    const userId = (session?.user as any)?.id
    if (userId) {
      setActiveUser(userId)
    } else {
      setActiveUser('guest')
    }
  }, [session, setActiveUser])

  useEffect(() => {
    setIsHome(window.location.pathname === '/')
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const currentItems = mounted ? (carts[activeUser] || []) : []
  const cartCount = currentItems.reduce((sum, item) => sum + item.quantity, 0)
  
  const isLight = !isHome || scrolled
  const user = session?.user;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-6"
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full border px-4 py-3 transition-all duration-500 shadow-2xl ${
          isLight
            ? "border-white/20 bg-white/70 backdrop-blur-2xl shadow-black/5"
            : "border-white/10 bg-black/10 backdrop-blur-md shadow-black/10"
        }`}
      >
        <a href="/" className="flex items-center gap-3 pl-2">
          <div className="relative size-10 overflow-hidden rounded-full bg-white shadow-sm transition-transform hover:scale-105 border border-primary/10">
            <Image 
              src="/logo.png" 
              alt="Trà Vinh Logo" 
              fill
              priority
              className="object-contain p-0.5" 
            />
          </div>
          <span className={`hidden sm:inline-block font-serif text-xl font-bold tracking-tight transition-colors ${
            isLight ? "text-foreground" : "text-white drop-shadow-md"
          }`}>
            Trà Vinh
          </span>
        </a>

        <div className="hidden items-center gap-2 md:flex bg-black/5 rounded-full px-2 py-1 backdrop-blur-sm">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                isLight 
                  ? "text-foreground/70 hover:bg-white hover:text-foreground hover:shadow-sm" 
                  : "text-white/80 hover:bg-white/20 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 pr-1">
          {mounted && (
            <button
              onClick={() => setCartOpen(true)}
              className={`relative grid size-11 place-items-center rounded-full transition-all duration-300 mr-2 hover:scale-105 ${
                isLight ? "bg-black/5 hover:bg-primary/10 text-foreground" : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <ShoppingBag className="size-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 border-2 border-white shadow-sm text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {user ? (
            <div className="hidden items-center gap-3 md:flex relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-3 pl-3 pr-1.5 py-1.5 rounded-full transition-all border ${
                  isLight 
                    ? "border-black/5 bg-white/50 hover:bg-white text-foreground" 
                    : "border-white/10 bg-black/20 hover:bg-black/40 text-white"
                }`}
              >
                <span className="text-sm font-bold max-w-[100px] truncate">{user.name}</span>
                <div className="size-8 rounded-full bg-primary/20 overflow-hidden relative border border-white/50 flex items-center justify-center">
                  {user.image ? (
                    <Image src={user.image} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <UserIcon className="size-4" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-14 w-48 rounded-2xl border border-black/5 bg-white/95 backdrop-blur-xl shadow-2xl p-2 z-50 flex flex-col gap-1"
                  >
                    <a href="/profile" className="px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-black/5 rounded-xl transition-colors">
                      Trang cá nhân
                    </a>
                    <button
                      onClick={() => signOut()}
                      className="px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <a
              href="/dang-nhap"
              className={`hidden rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 hover:scale-105 md:inline-block shadow-lg ${
                isLight 
                  ? "bg-primary text-white hover:bg-primary/90 shadow-primary/20" 
                  : "bg-white text-primary hover:bg-white/90 shadow-black/20"
              }`}
            >
              Đăng nhập
            </a>
          )}
          
          <button
            onClick={() => setOpen((v) => !v)}
            className={`grid size-11 place-items-center rounded-full transition-all md:hidden ${
              isLight
                ? "bg-black/5 text-foreground"
                : "bg-white/10 text-white"
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
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute inset-x-4 top-24 z-50 rounded-3xl border border-black/5 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl md:hidden"
          >
            {user && (
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-black/5">
                <div className="size-14 rounded-full bg-primary/10 overflow-hidden relative border-2 border-white shadow-sm flex items-center justify-center">
                  {user.image ? (
                    <Image src={user.image} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <UserIcon className="size-6 text-primary/60" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-foreground">{user.name}</h4>
                  <a href="/profile" onClick={() => setOpen(false)} className="text-sm font-medium text-primary hover:underline">Xem trang cá nhân</a>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3.5 text-base font-bold text-foreground/80 transition-colors hover:bg-black/5 hover:text-foreground flex items-center gap-3"
                >
                  <div className="size-2 rounded-full bg-primary/40" />
                  {l.label}
                </a>
              ))}
              
              <div className="my-2 h-px w-full bg-black/5" />
              
              {user ? (
                <button
                  onClick={() => {
                    setOpen(false)
                    signOut()
                  }}
                  className="rounded-2xl bg-red-50 text-red-600 px-4 py-4 text-center text-base font-bold transition-colors hover:bg-red-100 mt-2"
                >
                  Đăng xuất
                </button>
              ) : (
                <a
                  href="/dang-nhap"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-primary text-white px-4 py-4 text-center text-base font-bold transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-lg shadow-primary/20 mt-2"
                >
                  Đăng nhập / Đăng ký
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
