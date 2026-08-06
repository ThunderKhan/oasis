import Link from "next/link"
import { OasisLogo } from "@/components/layout/oasis-logo"
import { PageContainer } from "@/components/layout/page-container"

const productLinks = [
  { href: "/", label: "Home" },
  { href: "/assessment", label: "New Assessment" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/referrals", label: "Referrals" },
]

const clinicalLinks = [
  { href: "/about#oral-screening", label: "Oral screening support" },
  { href: "/about#breast-screening", label: "Breast screening support" },
  { href: "/about#cervical-screening", label: "Cervical screening support" },
  { href: "/about#referral-prioritisation", label: "Referral prioritisation" },
]

const safetyLinks = [
  { href: "/about", label: "About" },
  { href: "/about#model-limitations", label: "Model limitations" },
  { href: "/about#evidence-basis", label: "Evidence basis" },
  { href: "/about#clinical-disclaimer", label: "Clinical disclaimer" },
]

function FooterLinks({ title, links }: { title: string; links: typeof productLinks }) {
  return (
    <nav aria-label={`${title} links`}>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link className="inline-flex min-h-11 items-center text-sm text-muted underline-offset-4 hover:text-primary hover:underline" href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <PageContainer className="py-12 md:py-16" variant="wide">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
          <div className="flex max-w-md flex-col gap-5 sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label="O.A.S.I.S. home"
              className="flex items-center gap-3 rounded-lg font-semibold tracking-tight"
            >
              <OasisLogo className="size-10 text-primary" />
              <span>O.A.S.I.S.</span>
            </Link>
            <p className="text-sm font-medium leading-relaxed text-foreground">
              O.A.S.I.S. — Oncology Assessment &amp; Screening Information System
            </p>
            <p className="text-sm leading-relaxed text-muted">
              Structured screening and referral decision support for oral, breast, and cervical pathways.
            </p>
          </div>

          <FooterLinks title="Product" links={productLinks} />
          <FooterLinks title="Clinical Scope" links={clinicalLinks} />
          <FooterLinks title="Research & Safety" links={safetyLinks} />
        </div>

        <div id="clinical-disclaimer" className="mt-10 border-t border-border pt-8 md:mt-12">
          <p className="max-w-4xl text-sm leading-relaxed text-muted">
            O.A.S.I.S. is a screening and referral decision-support prototype. It does not diagnose or exclude cancer and does not replace clinical judgement.
          </p>
          <p className="mt-3 max-w-4xl text-sm font-medium leading-relaxed text-foreground">
            Urgent or concerning symptoms require direct clinical evaluation regardless of software output.
          </p>
          <p className="mt-6 text-xs text-subtle">Research prototype for clinician-facing decision support.</p>
        </div>
      </PageContainer>
    </footer>
  )
}
