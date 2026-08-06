"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { AlertTriangle, ArrowLeft, ArrowRight, FlaskConical, Loader2, RotateCcw, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Stepper, type StepDefinition } from "@/components/assessment/stepper"
import { PatientStep } from "@/components/assessment/steps/patient-step"
import { OralStep } from "@/components/assessment/steps/oral-step"
import { BreastStep } from "@/components/assessment/steps/breast-step"
import { CervicalStep } from "@/components/assessment/steps/cervical-step"
import { ReviewStep } from "@/components/assessment/steps/review-step"
import { useAssessmentStore } from "@/stores/assessment-store"
import { createAssessment, ApiError } from "@/lib/api"
import { validateSection, type FieldErrors } from "@/lib/validation"
import {
  clearSavedAssessment,
  loadSavedInput,
  loadSavedStep,
  saveInput,
  saveResult,
  saveStep,
} from "@/lib/session-persistence"
import { DEMO_SCENARIOS } from "@/lib/demo-scenarios"
import type { AssessmentInput } from "@/lib/assessment-types"

const STEPS: StepDefinition[] = [
  { id: "patient", label: "Patient" },
  { id: "oral", label: "Oral" },
  { id: "breast", label: "Breast" },
  { id: "cervical", label: "Cervical" },
  { id: "review", label: "Review" },
]

const STEP_TITLES: Record<string, { title: string; description: string }> = {
  patient: {
    title: "Patient details",
    description: "De-identified code, demographics, and consent.",
  },
  oral: {
    title: "Oral pathway",
    description: "Screening history, exposures, and oral symptoms.",
  },
  breast: {
    title: "Breast pathway",
    description: "Screening history, symptoms, and family history.",
  },
  cervical: {
    title: "Cervical pathway",
    description: "Screening history, symptoms, and optional risk factors.",
  },
  review: {
    title: "Review and submit",
    description: "Check all answers before sending for priority classification.",
  },
}

export function AssessmentWizard() {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const { input, updateSection, loadInput, setResult, submitting, setSubmitting, error, setError, reset } =
    useAssessmentStore()

  const [stepIndex, setStepIndex] = useState(0)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [hydrated, setHydrated] = useState(false)
  const [direction, setDirection] = useState(1)
  const [activeDemoScenario, setActiveDemoScenario] = useState<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Restore any in-progress assessment from sessionStorage.
  useEffect(() => {
    const savedInput = loadSavedInput()
    if (savedInput) {
      loadInput(savedInput)
      const savedStep = loadSavedStep()
      if (savedStep !== null && savedStep >= 0 && savedStep < STEPS.length) {
        setStepIndex(savedStep)
      }
    }
    setHydrated(true)
  }, [loadInput])

  // Persist as the user works.
  useEffect(() => {
    if (hydrated) saveInput(input)
  }, [input, hydrated])

  useEffect(() => {
    if (hydrated) saveStep(stepIndex)
  }, [stepIndex, hydrated])

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir)
    setStepIndex(index)
    setErrors({})
    requestAnimationFrame(() => headingRef.current?.focus())
  }, [])

  const currentStep = STEPS[stepIndex]

  const handleNext = () => {
    setError(null)
    if (currentStep.id !== "review") {
      const sectionErrors = validateSection(
        currentStep.id as keyof AssessmentInput,
        input[currentStep.id as keyof AssessmentInput],
      )
      if (Object.keys(sectionErrors).length > 0) {
        setErrors(sectionErrors)
        return
      }
    }
    goTo(Math.min(stepIndex + 1, STEPS.length - 1), 1)
  }

  const handleBack = () => {
    setError(null)
    goTo(Math.max(stepIndex - 1, 0), -1)
  }

  const handleSubmit = async () => {
    setError(null)

    // Final full validation before submission.
    for (const section of ["patient", "oral", "breast", "cervical"] as const) {
      const sectionErrors = validateSection(section, input[section])
      if (Object.keys(sectionErrors).length > 0) {
        setErrors(sectionErrors)
        goTo(STEPS.findIndex((s) => s.id === section), -1)
        return
      }
    }

    setSubmitting(true)
    try {
      const result = await createAssessment(input)
      setResult(result)
      saveResult(result)
      clearSavedAssessment()
      router.push("/results")
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          typeof err.detail === "string"
            ? err.detail
            : `The assessment service rejected the request (status ${err.status}). Please review the entries and try again.`,
        )
      } else {
        setError(
          "Could not reach the assessment service. Check that the backend is running, then try again. No data was saved.",
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    reset()
    clearSavedAssessment()
    setActiveDemoScenario(null)
    setErrors({})
    goTo(0, -1)
  }

  const loadDemo = (id: string) => {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === id)
    if (!scenario) return
    loadInput(structuredClone(scenario.input))
    setActiveDemoScenario(scenario.label)
    setErrors({})
    goTo(0, -1)
  }

  const meta = STEP_TITLES[currentStep.id]

  return (
    <div className="flex flex-col gap-6">
      {activeDemoScenario && (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-950 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-semibold">Demonstration data — not a real patient record</p>
              <p className="mt-0.5 text-sm text-amber-800">Loaded scenario: {activeDemoScenario}</p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="min-h-11 shrink-0 border-amber-400 bg-transparent text-amber-950 hover:bg-amber-100"
          >
            Clear demo data
          </Button>
        </div>
      )}

      <Stepper steps={STEPS} currentIndex={stepIndex} onStepSelect={(i) => goTo(i, -1)} />

      <Card>
        <CardHeader>
          <CardTitle>
            <span ref={headingRef} tabIndex={-1} className="outline-none">
              {meta.title}
            </span>
          </CardTitle>
          <CardDescription>{meta.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep.id}
              initial={reduceMotion ? false : { opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {currentStep.id === "patient" && (
                <PatientStep
                  value={input.patient}
                  errors={errors}
                  onChange={(patch) => updateSection("patient", patch)}
                />
              )}
              {currentStep.id === "oral" && (
                <OralStep
                  value={input.oral}
                  errors={errors}
                  onChange={(patch) => updateSection("oral", patch)}
                />
              )}
              {currentStep.id === "breast" && (
                <BreastStep
                  value={input.breast}
                  errors={errors}
                  onChange={(patch) => updateSection("breast", patch)}
                />
              )}
              {currentStep.id === "cervical" && (
                <CervicalStep
                  value={input.cervical}
                  errors={errors}
                  onChange={(patch) => updateSection("cervical", patch)}
                />
              )}
              {currentStep.id === "review" && <ReviewStep input={input} />}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-urgency-referral-border bg-urgency-referral-soft p-3.5 text-sm font-medium leading-relaxed text-urgency-referral"
        >
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBack} disabled={stepIndex === 0 || submitting}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back
          </Button>
          <Button variant="ghost" onClick={handleReset} disabled={submitting}>
            <RotateCcw aria-hidden="true" className="size-4" />
            Start over
          </Button>
        </div>
        {currentStep.id === "review" ? (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Send aria-hidden="true" className="size-4" />
            )}
            {submitting ? "Submitting…" : "Submit assessment"}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        )}
      </div>

      <details className="rounded-lg border border-border bg-surface p-4">
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted">
          <FlaskConical aria-hidden="true" className="size-4" />
          Load a demo scenario (fills the form with sample data)
        </summary>
        <ul className="mt-3 flex flex-col gap-2">
          {DEMO_SCENARIOS.map((scenario) => (
            <li key={scenario.id}>
              <button
                type="button"
                onClick={() => loadDemo(scenario.id)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-left transition-colors hover:border-primary hover:bg-primary-soft"
              >
                <span className="block text-sm font-medium text-foreground">{scenario.label}</span>
                <span className="block text-xs leading-relaxed text-muted">{scenario.summary}</span>
              </button>
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}