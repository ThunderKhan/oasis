import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { PageTransition } from "@/components/layout/page-transition"
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
      <body className="flex min-h-screen flex-col overflow-x-hidden font-sans">
        <SiteHeader />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL("https://oasis-opal-nine.vercel.app"),

  title: {
    default: "O.A.S.I.S. — Early Cancer Screening Decision Support",
    template: "%s | O.A.S.I.S.",
  },

  description:
    "Clinical decision-support for oral, breast and cervical cancer screening, referral prioritisation and printable reports.",

  openGraph: {
    title: "O.A.S.I.S. — Early Cancer Screening Decision Support",
    description:
      "Clinical decision-support for oral, breast and cervical cancer screening, referral prioritisation and printable reports.",
    url: "https://oasis-opal-nine.vercel.app",
    siteName: "O.A.S.I.S.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "O.A.S.I.S. — Oncology Assessment & Screening Information System",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "O.A.S.I.S. — Early Cancer Screening Decision Support",
    description:
      "Clinical decision-support for oral, breast and cervical cancer screening, referral prioritisation and printable reports.",
    images: ["/og-image.png"],
  },
}