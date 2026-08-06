import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata: Metadata = {
  title: {
    default: "O.A.S.I.S. — Oncology Assessment & Screening Information System",
    template: "%s | O.A.S.I.S.",
  },
  description:
    "Clinician-facing decision support for oral, breast, and cervical cancer screening prioritisation. Supports screening and referral decisions; does not diagnose cancer.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} bg-background`}>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
