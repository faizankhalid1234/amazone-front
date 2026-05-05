import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://amazone-front.vercel.app'),
  title: {
    default: 'Amazon Clone by Faizan Khalid | Online Shopping App',
    template: '%s | Amazon Clone by Faizan Khalid',
  },
  description:
    'Amazon-style e-commerce app by Faizan Khalid with product browsing, cart, checkout, account and orders pages.',
  keywords: [
    'Amazon clone',
    'e-commerce app',
    'online shopping',
    'Next.js store',
    'Faizan Khalid',
    'React e-commerce project',
  ],
  authors: [{ name: 'Faizan Khalid', url: 'https://portfolio-faizan-topaz.vercel.app/' }],
  creator: 'Faizan Khalid',
  publisher: 'Faizan Khalid',
  openGraph: {
    title: 'Amazon Clone by Faizan Khalid',
    description:
      'SEO-friendly Amazon clone project with modern UI, product listings, cart and checkout experience.',
    url: 'https://amazone-front.vercel.app',
    siteName: 'Amazon Clone by Faizan Khalid',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://amazone-front.vercel.app',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Amazone',
  },
}

export const viewport: Viewport = {
  themeColor: '#131921',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main style={{ minHeight: 'calc(100vh - 200px)' }}>
              {children}
            </main>
            <Footer />
            <ToastContainer position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
