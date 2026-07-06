import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Be_Vietnam_Pro } from 'next/font/google'
import { CartDrawer } from "@/components/landing/cart-drawer"
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-fraunces',
  display: 'swap',
})

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Trà Vinh — Miền đất của cây và nước',
  description:
    'Khám phá Trà Vinh: những ngôi chùa Khmer cổ kính, ao Bà Om huyền thoại, biển Ba Động và dừa sáp trứ danh miền Tây sông nước. Đặt tour và mua đặc sản ngay!',
  generator: 'Next.js',
  keywords: ['Trà Vinh', 'Du lịch Trà Vinh', 'Đặc sản Trà Vinh', 'Tour Trà Vinh', 'Khmer', 'Ao Bà Om'],
  authors: [{ name: 'Trà Vinh Tourism' }],
  creator: 'Trà Vinh Tourism',
  openGraph: {
    title: 'Trà Vinh — Miền đất của cây và nước',
    description: 'Khám phá Trà Vinh: những ngôi chùa Khmer cổ kính, ao Bà Om huyền thoại, biển Ba Động và dừa sáp trứ danh.',
    url: 'https://travinh.example.com',
    siteName: 'Trà Vinh Tourism',
    images: [
      {
        url: '/images/hero-bg.jpg', // Placeholder image if actual is missing
        width: 1200,
        height: 630,
        alt: 'Trà Vinh Tourism',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trà Vinh — Miền đất của cây và nước',
    description: 'Khám phá Trà Vinh: những ngôi chùa Khmer cổ kính, ao Bà Om huyền thoại, biển Ba Động và dừa sáp trứ danh.',
    images: ['/images/hero-bg.jpg'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#3f6b52',
}

import { AuthProvider } from "@/components/auth-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" className={`light scroll-smooth ${fraunces.variable} ${beVietnam.variable}`}>
      <body className="antialiased bg-background">
        <AuthProvider>
          <div 
            className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.035] mix-blend-overlay"
            style={{ backgroundImage: "url('/images/paper-texture.png')" }} 
          />
          {children}
          <CartDrawer />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AuthProvider>
      </body>
    </html>
  )
}
