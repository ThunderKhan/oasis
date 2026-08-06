"use client"

import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { OasisLogo } from "@/components/layout/oasis-logo"

export interface NavigationLink {
  href: string
  label: string
}

interface MobileNavigationProps {
  links: NavigationLink[]
  pathname: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function MobileNavigation({ links, pathname }: MobileNavigationProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const focusables = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
    const frame = window.requestAnimationFrame(() => focusables()[0]?.focus())

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
        return
      }

      if (event.key !== "Tab") return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      window.cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKeyDown)
      triggerRef.current?.focus()
    }
  }, [open])

  const drawer = (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div className="fixed inset-0 z-50 md:hidden">
          <motion.button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 cursor-default bg-foreground/25 backdrop-blur-[2px]"
            initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: "easeOut" }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            ref={panelRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-y-0 right-0 flex w-[min(88vw,24rem)] flex-col border-l border-border bg-surface shadow-2xl"
            initial={{ x: prefersReducedMotion ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: prefersReducedMotion ? 0 : "100%" }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
        <div className="flex min-h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2.5">
            <OasisLogo className="size-8 text-primary" />
            <span id={titleId} className="font-semibold tracking-tight">O.A.S.I.S.</span>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="flex size-11 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary-soft hover:text-primary"
            onClick={() => setOpen(false)}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <nav aria-label="Mobile primary" className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-5">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center rounded-lg px-3 text-base font-medium transition-colors",
              pathname === "/" ? "bg-primary-soft text-primary underline decoration-2 underline-offset-4" : "text-muted hover:bg-primary-soft hover:text-primary",
            )}
          >
            Home
          </Link>
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-lg px-3 text-base font-medium transition-colors",
                  active ? "bg-primary-soft text-primary underline decoration-2 underline-offset-4" : "text-muted hover:bg-primary-soft hover:text-primary",
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

            <div className="border-t border-border p-4">
              <Link
                href="/assessment"
                className="flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-5 font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Start assessment
              </Link>
              <p className="mt-3 text-center text-xs leading-relaxed text-subtle">
                Clinical decision support, not a diagnostic tool.
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        className="flex size-11 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary-soft hover:text-primary md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>
      {mounted ? createPortal(drawer, document.body) : null}
    </>
  )
}
