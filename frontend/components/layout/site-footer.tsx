import { SYSTEM_DISCLAIMER } from "@/lib/priority-config"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-6">
        <p className="text-sm text-muted">
          O.A.S.I.S. — Oncology Assessment &amp; Screening Information System
        </p>
        <p className="max-w-xl text-xs leading-relaxed text-subtle">{SYSTEM_DISCLAIMER}</p>
      </div>
    </footer>
  )
}
