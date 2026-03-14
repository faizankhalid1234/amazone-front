import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import Header from '../components/Header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const metadata: Metadata = {
  title: 'Amazon Clone - Online Shopping',
  description: 'Amazon Clone E-commerce Application',
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
            <footer style={{
              backgroundColor: '#131921',
              color: 'white',
              padding: '40px 20px',
              textAlign: 'center',
              marginTop: '50px'
            }}>
              <p>&copy; 2024 Amazon Clone. All rights reserved.</p>
            </footer>
            <ToastContainer position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
