import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { PageTransition } from "@/components/layout/page-transition"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://oasis-opal-nine.vercel.app"),

  title: {
    default: "O.A.S.I.S. — Early Cancer Screening Decision Support",
    template: "%s | O.A.S.I.S.",
  },

  description:
    "Clinical decision-support for oral, breast and cervical cancer screening, referral prioritisation and printable reports.",

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  openGraph: {
  title: "O.A.S.I.S. — Early Cancer Screening Decision Support",
  description:
    "Clinical decision-support for oral, breast and cervical cancer screening, referral prioritisation and printable reports.",
    url: "https://oasis-opal-nine.vercel.app",
    siteName: "O.A.S.I.S.",
    images: [
      {
        url: "https://oasis-opal-nine.vercel.app/og-image.png",
        secureUrl: "https://oasis-opal-nine.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "O.A.S.I.S. — Early Cancer Screening Decision Support",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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