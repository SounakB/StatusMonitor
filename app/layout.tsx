import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react" // Import React
import { UserProvider } from "@auth0/nextjs-auth0/client"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Status Page App",
  description: "A simplified version of Statuspage",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={inter.className}>{children}</body>
      </UserProvider>
    </html>
  )
}

