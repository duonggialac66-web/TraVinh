import Image from "next/image"
import { Reveal } from "./reveal"
import type { Festival } from "@/lib/default-content"

export function Festivals({ festivals }: { festivals: Festival[] }) {
  return (
    <section id="van-hoa" className="bg-primary px-5 py-16 text-primary-foreground sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
              <span className="h-px w-8 bg-accent" />
              Văn hóa &amp; lễ hội
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance font-serif text-4xl font-semibold leading-[1.05] sm:text-6xl">
              Hồn Khmer giữa lòng sông nước
            </h2>
          </Reveal>
        </div>

        <div className="flex flex-col gap-12">
          {festivals.map((fes, i) => (
            <div
              key={fes.id}
              className={`grid items-center gap-8 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Reveal y={40}>
                <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] shadow-2xl shadow-black/20">
                  <Image src={fes.image || "/placeholder.svg"} alt={fes.title} fill className="object-cover" />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div>
                  {fes.season && (
                    <span className="inline-block rounded-full border border-primary-foreground/25 px-4 py-1 text-sm text-primary-foreground/80">
                      {fes.season}
                    </span>
                  )}
                  <h3 className="mt-4 font-serif text-3xl font-semibold sm:text-5xl">{fes.title}</h3>
                  <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-primary-foreground/80">
                    {fes.description}
                  </p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
