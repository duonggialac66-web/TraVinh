import Image from "next/image"
import { Reveal } from "./reveal"
import type { Food } from "@/lib/default-content"

export function Foods({ foods }: { foods: Food[] }) {
  return (
    <section id="am-thuc" className="px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
              <span className="h-px w-8 bg-accent" />
              Ẩm thực đặc sản
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mx-auto mt-5 max-w-2xl text-balance font-serif text-4xl font-semibold leading-[1.05] text-foreground sm:text-6xl">
              Hương vị miệt vườn
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {foods.map((food, i) => (
            <Reveal key={food.id} delay={i * 0.1}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-card sm:flex-row">
                <div className="relative aspect-square w-full overflow-hidden sm:w-2/5">
                  <Image
                    src={food.image || "/placeholder.svg"}
                    alt={food.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-7">
                  <h3 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                    {food.title}
                  </h3>
                  <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                    {food.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
