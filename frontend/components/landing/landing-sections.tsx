"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  Check,
  ClipboardCheck,
  FileSearch,
  GitBranch,
  MessageSquareText,
  ScanLine,
  ShieldAlert,
  Stethoscope,
  Target,
  UserRoundSearch,
} from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"

const EASE = [0.22, 1, 0.36, 1] as const

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function SectionHeading({ id, eyebrow, title, body }: { id: string; eyebrow: string; title: string; body?: string }) {
  return (
    <Reveal className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2
        id={id}
        className="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-5xl"
      >
        {title}
      </h2>
      {body ? <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted">{body}</p> : null}
    </Reveal>
  )
}

const PROBLEMS = [
  { icon: FileSearch, title: "Risk history is scattered", body: "Exposure, family history, symptoms, and previous screening often live across disconnected notes." },
  { icon: ShieldAlert, title: "Red-flag symptoms can be overlooked", body: "High-concern findings need to rise above routine scoring and eligibility checks every time." },
  { icon: GitBranch, title: "Referral completion is difficult to track", body: "The path from initial concern to examination, referral, and follow-up is rarely visible in one place." },
]

const WORKFLOW = [
  "Capture patient history",
  "Identify red flags",
  "Check screening eligibility",
  "Generate explainable priority",
  "Prepare referral",
  "Track follow-up",
]

const CANCER_PATHWAYS = [
  { icon: ScanLine, title: "Oral screening", points: ["tobacco and areca-nut exposure", "persistent lesions", "oral examination priority"] },
  { icon: UserRoundSearch, title: "Breast screening", points: ["symptoms", "personal and family history", "clinical examination eligibility"] },
  { icon: Stethoscope, title: "Cervical screening", points: ["previous screening", "abnormal results", "symptom and follow-up priority"] },
]

const REASONS = [
  "Persistent white oral patch",
  "Long-term smokeless tobacco exposure",
  "Areca-nut exposure",
  "Screening overdue",
]

const RESEARCH = [
  { icon: ClipboardCheck, title: "Clinical decision support in oncology", body: "Structured support that keeps clinical judgement and local pathways at the centre." },
  { icon: ChartNoAxesCombined, title: "Machine-learning risk stratification", body: "Statistical signals can support prioritisation without overriding clinical warning signs." },
  { icon: MessageSquareText, title: "Explainable probability models", body: "Outputs are paired with the specific findings that contributed to each recommendation." },
  { icon: Target, title: "Multimodal future extension", body: "A research direction for responsibly combining structured data with additional clinical inputs." },
]

export function LandingSections() {
  const reduceMotion = useReducedMotion()

  return (
    <>
      <section className="bg-surface py-20 md:py-28" aria-labelledby="problem-heading">
        <PageContainer variant="wide">
          <SectionHeading id="problem-heading" eyebrow="The care gap" title="Screening decisions are often delayed by fragmented information." />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {PROBLEMS.map((problem, index) => (
              <Reveal key={problem.title} delay={index * 0.08}>
                <article className="flex min-h-full flex-col rounded-card border border-border bg-background p-6 transition-colors hover:border-border-strong">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-primary-soft text-primary"><problem.icon aria-hidden="true" /></span>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">{problem.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{problem.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </PageContainer>
      </section>

      <section id="how-it-works" className="scroll-mt-24 border-y border-border bg-background py-20 md:py-28" aria-labelledby="workflow-heading">
        <PageContainer variant="wide">
          <SectionHeading
            id="workflow-heading"
            eyebrow="The O.A.S.I.S. workflow"
            title="One structured workflow. Three cancer pathways."
            body="Move from the patient encounter to a visible next action without hiding the clinical reasoning in a black box."
          />
          <div className="mt-14 md:grid md:grid-cols-6 md:gap-0">
            {WORKFLOW.map((step, index) => (
              <Reveal key={step} delay={index * 0.07} className="relative flex gap-4 pb-8 last:pb-0 md:block md:pb-0">
                {index < WORKFLOW.length - 1 ? (
                  <div
                    className="absolute bottom-0 left-4 top-8 w-px bg-border-strong md:bottom-auto md:left-1/2 md:right-0 md:top-4 md:h-px md:w-full"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-primary bg-surface text-sm font-semibold text-primary md:mx-auto">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm font-semibold leading-relaxed text-foreground md:px-3 md:pt-5 md:text-center">{step}</p>
              </Reveal>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="bg-surface py-20 md:py-28" aria-labelledby="pathway-heading">
        <PageContainer variant="wide">
          <SectionHeading id="pathway-heading" eyebrow="Pathway coverage" title="Focused support for three screening pathways." body="Each pathway captures the risk factors, symptoms, and screening context that matter to its clinical workflow." />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {CANCER_PATHWAYS.map((pathway, index) => (
              <Reveal key={pathway.title} delay={index * 0.08}>
                <article className="group flex min-h-full flex-col rounded-card border border-border-strong bg-background p-7 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-primary">
                  <span className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105"><pathway.icon aria-hidden="true" /></span>
                  <h3 className="mt-7 text-2xl font-semibold tracking-tight text-foreground">{pathway.title}</h3>
                  <ul className="mt-6 flex flex-col gap-3">
                    {pathway.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="first-letter:uppercase">{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="border-y border-border bg-primary py-20 text-primary-foreground md:py-28" aria-labelledby="safety-heading">
        <PageContainer variant="wide">
          <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary-foreground/75">Safety-first architecture</p>
              <h2 id="safety-heading" className="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] md:text-5xl">Clinical warning signs always come first.</h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-primary-foreground/80">A low model output never suppresses a concerning symptom or abnormal examination finding.</p>
            </Reveal>
            <Reveal className="rounded-card border border-primary-foreground/20 bg-primary-hover p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">Decision hierarchy</p>
              <div className="mt-5 flex flex-col gap-3 text-center">
                {["Routine guidance", "Screening priority", "Prompt Referral"].map((label, index) => (
                  <motion.div
                    key={label}
                    className={index === 2 ? "rounded-lg bg-primary-foreground px-5 py-4 font-semibold text-primary" : "rounded-lg border border-primary-foreground/25 px-5 py-3 text-sm text-primary-foreground/80"}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: reduceMotion ? 0 : index * 0.12, duration: reduceMotion ? 0 : 0.4 }}
                  >
                    {label}
                  </motion.div>
                ))}
              </div>
              <div className="mt-7 border-t border-primary-foreground/20 pt-6 text-center">
                <p className="text-sm text-primary-foreground/70">Final recommendation = highest urgency of</p>
                <p className="mt-2 text-lg font-semibold">Red flags + Screening eligibility + Statistical support</p>
              </div>
            </Reveal>
          </div>
        </PageContainer>
      </section>

      <section className="bg-background py-20 md:py-28" aria-labelledby="explainability-heading">
        <PageContainer variant="wide">
          <div className="grid items-center gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
            <SectionHeading
              id="explainability-heading"
              eyebrow="Explainability built in"
              title="See the recommendation and the reasons behind it."
              body="Every priority is traceable to the patient information that produced it, so clinicians can review the recommendation in context."
            />
            <Reveal className="overflow-hidden rounded-card border border-border-strong bg-surface shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-6">
                <div>
                  <p className="text-sm font-medium text-muted">Oral pathway</p>
                  <p className="mt-1 text-2xl font-semibold text-urgency-referral">Prompt Referral</p>
                </div>
                <div className="rounded-lg bg-primary-soft px-4 py-3 text-right">
                  <p className="text-xs font-medium text-muted">Screening Priority Index</p>
                  <p className="mt-1 text-2xl font-semibold text-primary">95/100</p>
                </div>
              </div>
              <div className="grid gap-6 p-6 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">Why</p>
                  <ul className="mt-4 flex flex-col gap-3">
                    {REASONS.map((reason, index) => (
                      <motion.li
                        key={reason}
                        className="flex items-start gap-3 text-sm leading-relaxed text-muted"
                        initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ delay: reduceMotion ? 0 : index * 0.1, duration: reduceMotion ? 0 : 0.35 }}
                      >
                        <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-urgency-referral" />
                        {reason}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-border bg-background p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-subtle">Recommended action</p>
                  <p className="mt-3 font-semibold leading-relaxed text-foreground">Prompt clinical oral examination and referral.</p>
                  <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted">This is a referral-priority recommendation, not a cancer diagnosis.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </PageContainer>
      </section>

      <section className="border-y border-border bg-surface py-20 md:py-28" aria-labelledby="comparison-heading">
        <PageContainer variant="wide">
          <SectionHeading id="comparison-heading" eyebrow="Workflow comparison" title="Replace uncertainty with a visible care pathway." />
          <div className="mt-10 grid overflow-hidden rounded-card border border-border-strong md:grid-cols-2">
            <Reveal className="bg-background p-7 md:p-9">
              <p className="text-sm font-semibold uppercase tracking-widest text-subtle">Before O.A.S.I.S.</p>
              <ul className="mt-6 flex flex-col gap-4">
                {["scattered notes", "subjective triage", "unclear referral priority", "no follow-up visibility"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-muted"><span className="size-1.5 rounded-full bg-subtle" /><span className="first-letter:uppercase">{item}</span></li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="border-t border-border bg-primary-soft p-7 md:border-l md:border-t-0 md:p-9" delay={0.1}>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">With O.A.S.I.S.</p>
              <ul className="mt-6 flex flex-col gap-4">
                {["structured assessment", "safety overrides", "explainable recommendation", "trackable referral"].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-medium text-foreground"><span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check aria-hidden="true" className="size-3.5" /></span><span className="first-letter:uppercase">{item}</span></li>
                ))}
              </ul>
            </Reveal>
          </div>
        </PageContainer>
      </section>

      <section className="bg-background py-20 md:py-28" aria-labelledby="research-heading">
        <PageContainer variant="wide">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading id="research-heading" eyebrow="Research-backed direction" title="Designed around evidence, transparency, and extension." />
            <Reveal>
              <Link href="/about#evidence-basis" className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline">Explore the evidence basis <ArrowRight aria-hidden="true" /></Link>
            </Reveal>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RESEARCH.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.07}>
                <article className="min-h-full rounded-card border border-border bg-surface p-6">
                  <item.icon aria-hidden="true" className="text-primary" />
                  <h3 className="mt-5 font-semibold leading-snug text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="bg-surface py-20 md:py-28" aria-labelledby="final-cta-heading">
        <PageContainer variant="wide">
          <Reveal className="rounded-card border border-border-strong bg-primary-soft px-6 py-14 text-center md:px-12 md:py-20">
            <BookOpen aria-hidden="true" className="mx-auto size-10 text-primary" />
            <h2 id="final-cta-heading" className="mx-auto mt-6 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-5xl">Turn fragmented history into a clear next action.</h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/assessment" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">Start Assessment <ArrowRight aria-hidden="true" /></Link>
              <Link href="/dashboard" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-border-strong bg-surface px-6 font-semibold text-foreground transition-colors hover:bg-background">View Demo Dashboard</Link>
            </div>
          </Reveal>
        </PageContainer>
      </section>
    </>
  )
}