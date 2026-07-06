import { Mail, Phone, MapPin } from "lucide-react"
import { Reveal } from "./reveal"
import type { SiteContent } from "@/lib/default-content"

export function Contact({ content }: { content: SiteContent }) {
  return (
    <section id="lien-he" className="px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid overflow-hidden rounded-[2.5rem] border border-border bg-card lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <Reveal>
              <span className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
                <span className="h-px w-8 bg-accent" />
                Liên hệ
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-balance font-serif text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl">
                {content.contactHeading}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-pretty leading-relaxed text-muted-foreground">
                {content.contactBody}
              </p>
            </Reveal>

            <div className="mt-8 flex flex-col gap-4">
              <Reveal delay={0.15}>
                <a
                  href={`mailto:${content.contactEmail}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-accent"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-secondary text-primary">
                    <Mail className="size-5" />
                  </span>
                  <span className="text-foreground">{content.contactEmail}</span>
                </a>
              </Reveal>
              <Reveal delay={0.2}>
                <a
                  href={`tel:${content.contactPhone.replace(/\s/g, "")}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-accent"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-secondary text-primary">
                    <Phone className="size-5" />
                  </span>
                  <span className="text-foreground">{content.contactPhone}</span>
                </a>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4">
                  <span className="grid size-11 place-items-center rounded-full bg-secondary text-primary">
                    <MapPin className="size-5" />
                  </span>
                  <span className="text-foreground">Tỉnh Trà Vinh, Đồng bằng sông Cửu Long</span>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="relative min-h-[360px] bg-secondary">
            <iframe
              title="Bản đồ Trà Vinh"
              src={content.mapEmbedUrl}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
