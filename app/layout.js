import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ClientProviders } from '@/components/ClientProviders'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "ResourceNYC — Find NYC Benefits & Programs",
  description: "AI-powered benefit navigator for New Yorkers. Describe your situation and find food, health, housing, and financial programs you qualify for.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ margin: 0, minHeight: '100vh' }}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
