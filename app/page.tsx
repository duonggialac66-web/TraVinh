import { getLandingData } from "@/lib/content"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { About } from "@/components/landing/about"
import { Locations } from "@/components/landing/locations"
import { Foods } from "@/components/landing/foods"
import { Tours } from "@/components/landing/tours"
import { Products } from "@/components/landing/products"
import { CultureBlog } from "@/components/landing/culture-blog"
import { Contact } from "@/components/landing/contact"
import { Footer } from "@/components/landing/footer"


export default async function Page() {
  const { content, locations, festivals, foods, tours, products, gallery } = await getLandingData()

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <Hero content={content} />
      <About content={content} />
      <Locations locations={locations} />
      <Tours tours={tours} />
      <Foods foods={foods} />
      <Products products={products} />
      <CultureBlog posts={festivals} />
      <Contact content={content} />
      <Footer />
    </main>
  )
}
