"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowRight, Check, ShieldCheck } from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"

const TRUST_ITEMS = [
  "Explainable recommendations",
  "Red-flag safety overrides",
  "Screening workflow support",
  "Referral prioritisation",
]

const PATHWAYS = [
  { name: "Oral", short: "O" },
  { name: "Breast", short: "B" },
  { name: "Cervical", short: "C" },
]

const STAGES = ["History", "Risk signals", "Safety rules", "Recommendation"]

export function Hero() {
  const reduceMotion = useReducedMotion()
  const enter = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <section className="relative overflow-hidden border-b border-border bg-background pb-12 pt-12 md:pb-16 md:pt-20">
      <PageContainer variant="wide">
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div>
            <motion.p {...enter(0)} className="text-sm font-semibold uppercase tracking-widest text-primary">
              Explainable early cancer screening support
            </motion.p>
            <motion.h1
              {...enter(0.08)}
              className="mt-5 max-w-3xl text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.04em] text-foreground md:text-6xl lg:text-7xl"
            >
              From patient history to timely referral.
            </motion.h1>
            <motion.p {...enter(0.16)} className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              O.A.S.I.S. helps frontline healthcare workers assess oral, breast, and cervical screening priorities using structured history, clinical safety rules, and explainable recommendations.
            </motion.p>
            <motion.div {...enter(0.24)} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/assessment"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Start an Assessment
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface px-6 font-semibold text-foreground transition-colors hover:bg-primary-soft"
              >
                Explore How It Works
                <ArrowDown aria-hidden="true" />
              </Link>
            </motion.div>
          </div>

          <motion.div {...enter(0.18)} className="rounded-card border border-border-strong bg-surface p-4 shadow-sm md:p-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-subtle">Clinical pathway engine</p>
                <p className="mt-1 text-sm font-medium text-foreground">Structured assessment flow</p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                <ShieldCheck aria-hidden="true" />
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-4">
              {PATHWAYS.map((pathway, pathwayIndex) => (
                <div key={pathway.name} className="grid grid-cols-[5rem_1fr] items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {pathway.short}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{pathway.name}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center">
                    {STAGES.map((stage, stageIndex) => (
                      <div key={stage} className="relative flex min-w-0 items-center">
                        {stageIndex > 0 ? (
                          <div className="absolute right-1/2 h-px w-full bg-border-strong" aria-hidden="true">
                            <motion.span
                              className="block h-px bg-primary"
                              initial={reduceMotion ? false : { scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.45 + pathwayIndex * 0.12 + stageIndex * 0.1 }}
                              style={{ transformOrigin: "left" }}
                            />
                          </div>
                        ) : null}
                        <motion.span
                          className="relative mx-auto flex size-7 items-center justify-center rounded-full border border-border-strong bg-surface text-primary"
                          initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: reduceMotion ? 0 : 0.3, delay: 0.3 + pathwayIndex * 0.12 + stageIndex * 0.1 }}
                        >
                          <Check aria-hidden="true" className="size-3.5" />
                        </motion.span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-[5rem_1fr] gap-3 border-t border-border pt-3">
              <span />
              <div className="grid grid-cols-4 text-center text-[0.65rem] font-medium leading-tight text-subtle">
                {STAGES.map((stage) => <span key={stage}>{stage}</span>)}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.ul {...enter(0.36)} className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm font-medium text-muted">
              <Check aria-hidden="true" className="size-4 text-primary" />
              {item}
            </li>
          ))}
        </motion.ul>
      </PageContainer>
    </section>
  )
}
