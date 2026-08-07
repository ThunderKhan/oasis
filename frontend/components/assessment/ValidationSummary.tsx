"use client"

import { useEffect, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import type { FieldErrors } from "@/lib/validation"

export function ValidationSummary({ errors }: { errors: FieldErrors }) {
  const messages = Object.values(errors)
  const summaryRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (messages.length > 0) summaryRef.current?.focus()
  }, [messages.length])

  if (messages.length === 0) return null
  return (
    <motion.div
      ref={summaryRef}
      tabIndex={-1}
      role="alert"
      aria-live="assertive"
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-3 rounded-lg border border-urgency-referral-border bg-urgency-referral-soft p-4 text-urgency-referral outline-none"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold">Please review this section</p>
        <p className="text-sm leading-relaxed">{messages.length === 1 ? messages[0] : `${messages.length} responses need attention before you can continue.`}</p>
      </div>
    </motion.div>
  )
}
