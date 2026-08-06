"use client"

import { motion, useReducedMotion } from "framer-motion"
import { PRIORITY_CONFIG, PRIORITY_ORDER } from "@/lib/priority-config"
import { PriorityBadge } from "@/components/results/priority-badge"

export function UrgencyLegend() {
  const reduceMotion = useReducedMotion()

  return (
    <section aria-labelledby="urgency-heading" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <h2 id="urgency-heading" className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
        Six urgency categories, one shared language
      </h2>
      <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted">
        Every pathway resolves to one of six categories. Icons and labels carry the meaning —
        colour reinforces it, never replaces it.
      </p>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PRIORITY_ORDER.map((key, i) => {
          const config = PRIORITY_CONFIG[key]
          return (
            <motion.li
              key={key}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-2.5 rounded-card border border-border bg-surface p-4"
            >
              <PriorityBadge priority={key} size="sm" />
              <p className="text-sm leading-relaxed text-muted">{config.description}</p>
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}
