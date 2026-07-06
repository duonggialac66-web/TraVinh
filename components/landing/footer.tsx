import Link from "next/link"

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/70">
              Miền đất chín rồng
            </p>
            <p className="mt-3 max-w-sm text-pretty text-primary-foreground/85">
              Trang giới thiệu quê hương Trà Vinh — nơi phù sa, hồn Khmer và biển mặn hòa quyện.
            </p>
          </div>
          <Link
            href="/admin/login"
            className="w-fit rounded-full border border-primary-foreground/25 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-primary-foreground hover:text-primary"
          >
            Quản trị nội dung
          </Link>
        </div>

        <div className="mt-12 h-px w-full bg-primary-foreground/15" />

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-sm text-primary-foreground/60 sm:flex-row">
          <span>© {new Date().getFullYear()} Trà Vinh. Thực hiện với tình yêu quê hương.</span>
          <span>Đồng bằng sông Cửu Long, Việt Nam</span>
        </div>
      </div>

      <div aria-hidden className="select-none px-5">
        <p className="-mb-6 text-center font-serif text-[clamp(4rem,22vw,18rem)] font-semibold leading-none text-primary-foreground/10">
          Trà Vinh
        </p>
      </div>
    </footer>
  )
}
