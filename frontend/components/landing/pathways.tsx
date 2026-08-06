"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ClipboardList, ListChecks, Send } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const STEPS = [
  {
    icon: ClipboardList,
    title: "Capture the encounter",
    body: "Guided intake for patient history, screening history, risk factors, symptoms, and examination findings across oral, breast, and cervical pathways.",
  },
  {
    icon: ListChecks,
    title: "Classify each pathway",
    body: "Each pathway is classified into one of six urgency categories with a transparent Screening Priority Index and the specific factors behind it.",
  },
  {
    icon: Send,
    title: "Act on clear next steps",
    body: "Recommended actions map to local screening and referral pathways, with red-flag findings surfaced prominently — never buried in a score.",
  },
]

export function Pathways() {
  const reduceMotion = useReducedMotion()

  return (
    <section aria-labelledby="pathways-heading" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <h2 id="pathways-heading" className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
          From encounter to explainable priority
        </h2>
        <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted">
          Three pathways, one structured workflow. Every classification is traceable to the
          findings that produced it.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <step.icon aria-hidden="true" className="size-4.5" />
                  </span>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{step.body}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
