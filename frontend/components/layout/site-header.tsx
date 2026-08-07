"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { MobileNavigation, type NavigationLink } from "@/components/layout/mobile-navigation"
import { OasisLogo } from "@/components/layout/oasis-logo"
import { PageContainer } from "@/components/layout/page-container"

const NAV_LINKS: NavigationLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/referrals", label: "Referrals" },
  { href: "/about", label: "About" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
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
        "sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-[250ms] motion-reduce:transition-none",
        solid
          ? "border-b border-border bg-surface/95 shadow-sm backdrop-blur-sm"
          : "border-b border-transparent bg-transparent",
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

        <nav aria-label="Primary" className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-muted hover:bg-primary-soft hover:text-primary",
                )}
              >
                {link.label}
                {active ? (
                  <motion.span
                    layoutId={reduceMotion ? undefined : "primary-navigation-indicator"}
                    className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-primary"
                    transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden="true"
                  />
                ) : null}
              </Link>
            )
          })}
          <Link
            href="/assessment"
            aria-current={pathname === "/assessment" ? "page" : undefined}
            className="flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Start Assessment
          </Link>
        </nav>

        <MobileNavigation links={NAV_LINKS} pathname={pathname} />
      </PageContainer>
    </header>
  )
}
