import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AuthProvider from "../../providers/auth-provider"
import { ToastProvider } from "../../providers/react-toast-provider"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dev Gamification",
  description: "A platform for developers to learn and compete",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>)
{
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}