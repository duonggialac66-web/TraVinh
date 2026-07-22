import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./profile-client";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/dang-nhap");
  }

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true, password: true },
  });

  if (!user) {
    redirect("/dang-nhap");
  }

  const productOrders = await prisma.productOrder.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const tourBookings = await prisma.tourBooking.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const hasPassword = !!user.password;

  return (
    <main className="relative min-h-screen bg-[#F9F8F6] overflow-x-hidden">
      <Navbar />
      
      {/* Decorative Header */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-primary/20 via-primary/5 to-[#F9F8F6] -z-10" />
      <div className="absolute top-0 left-0 right-0 h-[40vh] bg-[url('/images/pattern-leaf.png')] opacity-5 mix-blend-multiply -z-10" />
      
      <div className="pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 tracking-tight">Hồ sơ cá nhân</h1>
            <p className="text-foreground/60 font-medium text-lg max-w-2xl mx-auto">
              Quản lý thông tin, lịch sử đơn hàng và các chuyến đi khám phá Trà Vinh của bạn.
            </p>
          </div>
          
          <ProfileClient
            user={{ id: user.id, name: user.name, email: user.email, image: user.image, hasPassword }}
            productOrders={productOrders}
            tourBookings={tourBookings}
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}
