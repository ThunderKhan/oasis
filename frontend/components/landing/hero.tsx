"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DisclaimerBanner } from "@/components/layout/disclaimer-banner"

export function Hero() {
  const reduceMotion = useReducedMotion()
  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 md:px-6 md:pb-24 md:pt-20">
      <div className="max-w-3xl">
        <motion.p {...fade(0)} className="text-sm font-semibold uppercase tracking-widest text-primary">
          Oncology Assessment &amp; Screening Information System
        </motion.p>
        <motion.h1
          {...fade(0.08)}
          className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-6xl"
        >
          Structured screening triage for frontline cancer care
        </motion.h1>
        <motion.p {...fade(0.16)} className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
          O.A.S.I.S. helps healthcare workers capture history, risk factors, symptoms, and
          examination findings for oral, breast, and cervical cancer pathways — and turns them
          into a clear, explainable screening and referral priority.
        </motion.p>
        <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/assessment">
            <Button size="lg" className="gap-2">
              Start an assessment
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline">
              How it works
            </Button>
          </Link>
        </motion.div>
        <motion.div {...fade(0.32)}>
          <DisclaimerBanner className="mt-10 max-w-2xl" />
        </motion.div>
      </div>
    </section>
  )
}
