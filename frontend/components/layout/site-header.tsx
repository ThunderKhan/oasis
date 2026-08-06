"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { MobileNavigation, type NavigationLink } from "@/components/layout/mobile-navigation"
import { OasisLogo } from "@/components/layout/oasis-logo"
import { PageContainer } from "@/components/layout/page-container"

const NAV_LINKS: NavigationLink[] = [
  { href: "/assessment", label: "New assessment" },
  { href: "/results", label: "Results" },
  { href: "/referrals", label: "Referrals" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const landing = pathname === "/"
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!landing) {
      setScrolled(false)
      return
    }

    const update = () => setScrolled(window.scrollY > 16)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [landing])

  const solid = !landing || scrolled

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-250 motion-reduce:transition-none",
        solid
          ? "border-b border-border bg-surface/95 shadow-sm backdrop-blur-sm"
          : "border-b border-transparent bg-background",
      )}
    >
      <PageContainer className="flex h-16 items-center justify-between gap-4" variant="wide">
        <Link
          href="/"
          aria-label="O.A.S.I.S. — Oncology Assessment and Screening Information System, home"
          className="flex min-h-11 min-w-0 items-center gap-2.5 rounded-lg"
        >
          <OasisLogo className="size-8 text-primary" />
          <span className="shrink-0 font-semibold tracking-tight">O.A.S.I.S.</span>
          <span className="hidden truncate border-l border-border pl-3 text-sm text-muted xl:inline">
            Oncology Assessment &amp; Screening Information System
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-soft text-primary underline decoration-2 underline-offset-4"
                    : "text-muted hover:bg-primary-soft hover:text-primary",
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <MobileNavigation links={NAV_LINKS} pathname={pathname} />
      </PageContainer>
    </header>
  )
}
