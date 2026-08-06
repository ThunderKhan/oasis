"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  FlaskConical,
  Loader2,
  RotateCcw,
  Send,
  ShieldCheck,
} from "lucide-react"
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
import { generatePatientCode } from "@/lib/initial-assessment"
import {
  clearSavedAssessment,
  loadSavedInput,
  loadSavedStep,
  saveInput,
  saveResult,
  saveStep,
} from "@/lib/session-persistence"
import { DEMO_SCENARIOS } from "@/lib/demo-scenarios"
import { cn } from "@/lib/utils"
import type { AssessmentInput } from "@/lib/assessment-types"

const STEPS: StepDefinition[] = [
  { id: "patient", label: "Patient" },
  { id: "oral", label: "Oral" },
  { id: "breast", label: "Breast" },
  { id: "cervical", label: "Cervical" },
  { id: "review", label: "Review" },
]

const STEP_TITLES: Record<string, { title: string; description: string }> = {
  patient: { title: "Patient details", description: "De-identified code, demographics, and consent." },
  oral: { title: "Oral pathway", description: "Screening history, exposures, and oral symptoms." },
  breast: { title: "Breast pathway", description: "Screening history, symptoms, and family history." },
  cervical: { title: "Cervical pathway", description: "Screening history, symptoms, and optional risk factors." },
  review: { title: "Review and submit", description: "Check all answers before sending for priority classification." },
}

const SUBMISSION_MESSAGES = [
  "Reviewing screening eligibility",
  "Checking clinical safety rules",
  "Preparing explainable recommendation",
]

interface UtilityPanelProps {
  activeDemoScenario: string | null
  submitting: boolean
  onReset: () => void
  onLoadDemo: (id: string) => void
}

function UtilityPanel({ activeDemoScenario, submitting, onReset, onLoadDemo }: UtilityPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-start gap-2.5">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm font-semibold text-foreground">Session protected</p>
            <p className="text-xs leading-relaxed text-muted">
              Progress stays in this browser tab until submission or reset.
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" className="mt-3 w-full" onClick={onReset} disabled={submitting}>
          <RotateCcw data-icon="inline-start" aria-hidden="true" />
          Start over
        </Button>
      </div>

      <details className="rounded-lg border border-border bg-surface p-4">
        <summary className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium text-muted outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          <FlaskConical aria-hidden="true" className="size-4 shrink-0" />
          Demo scenarios
        </summary>
        {activeDemoScenario && (
          <p className="mb-2 text-xs font-medium leading-relaxed text-urgency-referral">
            Loaded: {activeDemoScenario}
          </p>
        )}
        <ul className="flex flex-col gap-2">
          {DEMO_SCENARIOS.map((scenario) => (
            <li key={scenario.id}>
              <button
                type="button"
                onClick={() => onLoadDemo(scenario.id)}
                disabled={submitting}
                className="min-h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-left outline-none transition-colors hover:border-primary hover:bg-primary-soft focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

export function AssessmentWizard() {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const { input, updateSection, loadInput, setResult, submitting, setSubmitting, error, setError, reset } =
    useAssessmentStore()

  const [stepIndex, setStepIndex] = useState(0)
  const [furthestIndex, setFurthestIndex] = useState(0)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [hydrated, setHydrated] = useState(false)
  const [direction, setDirection] = useState(1)
  const [activeDemoScenario, setActiveDemoScenario] = useState<string | null>(null)
  const [submissionMessageIndex, setSubmissionMessageIndex] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const savedInput = loadSavedInput()
    if (savedInput) {
      loadInput(savedInput)
      const savedStep = loadSavedStep()
      if (savedStep !== null && savedStep >= 0 && savedStep < STEPS.length) {
        setStepIndex(savedStep)
        setFurthestIndex(savedStep)
      }
    } else {
      updateSection("patient", { patient_code: generatePatientCode() })
    }
    setHydrated(true)
  }, [loadInput, updateSection])

  useEffect(() => {
    if (hydrated) saveInput(input)
  }, [input, hydrated])

  useEffect(() => {
    if (hydrated) saveStep(stepIndex)
  }, [stepIndex, hydrated])

  useEffect(() => {
    if (!submitting) {
      setSubmissionMessageIndex(0)
      return
    }
    const second = window.setTimeout(() => setSubmissionMessageIndex(1), 350)
    const third = window.setTimeout(() => setSubmissionMessageIndex(2), 700)
    return () => {
      window.clearTimeout(second)
      window.clearTimeout(third)
    }
  }, [submitting])

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir)
    setStepIndex(index)
    setErrors({})
    requestAnimationFrame(() => headingRef.current?.focus())
  }, [])

  const currentStep = STEPS[stepIndex]
  const meta = STEP_TITLES[currentStep.id]

  const handleNext = () => {
    setError(null)
    if (currentStep.id !== "review") {
      const section = currentStep.id as keyof AssessmentInput
      const sectionErrors = validateSection(section, input[section])
      if (Object.keys(sectionErrors).length > 0) {
        setErrors(sectionErrors)
        return
      }
    }
    const nextIndex = Math.min(stepIndex + 1, STEPS.length - 1)
    setFurthestIndex((current) => Math.max(current, nextIndex))
    goTo(nextIndex, 1)
  }

  const handleBack = () => {
    setError(null)
    goTo(Math.max(stepIndex - 1, 0), -1)
  }

  const handleStepSelect = (index: number) => {
    if (submitting || index > furthestIndex) return
    goTo(index, index >= stepIndex ? 1 : -1)
  }

  const handleSubmit = async () => {
    setError(null)
    for (const section of ["patient", "oral", "breast", "cervical"] as const) {
      const sectionErrors = validateSection(section, input[section])
      if (Object.keys(sectionErrors).length > 0) {
        setErrors(sectionErrors)
        goTo(STEPS.findIndex((step) => step.id === section), -1)
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
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        setError(
          typeof caughtError.detail === "string"
            ? caughtError.detail
            : `The assessment service rejected the request (status ${caughtError.status}). Please review the entries and try again.`,
        )
      } else {
        setError("Could not reach the assessment service. Check that the backend is running, then try again. No data was saved.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    reset()
    updateSection("patient", { patient_code: generatePatientCode() })
    clearSavedAssessment()
    setActiveDemoScenario(null)
    setFurthestIndex(0)
    setErrors({})
    goTo(0, -1)
  }

  const loadDemo = (id: string) => {
    const scenario = DEMO_SCENARIOS.find((item) => item.id === id)
    if (!scenario) return
    loadInput(structuredClone(scenario.input))
    setActiveDemoScenario(scenario.label)
    setFurthestIndex(0)
    setErrors({})
    goTo(0, -1)
  }

  const actionButtons = (mobile = false) => (
    <div className={cn("flex items-center gap-2", mobile ? "w-full" : "justify-between")}>
      <Button
        type="button"
        variant="outline"
        onClick={handleBack}
        disabled={stepIndex === 0 || submitting}
        className={mobile ? "flex-1" : undefined}
      >
        <ArrowLeft data-icon="inline-start" aria-hidden="true" />
        Back
      </Button>
      {currentStep.id === "review" ? (
        <Button type="button" onClick={handleSubmit} disabled={submitting} className={mobile ? "flex-[1.5]" : undefined}>
          {submitting ? (
            <Loader2 data-icon="inline-start" aria-hidden="true" className={reduceMotion ? undefined : "animate-spin"} />
          ) : (
            <Send data-icon="inline-start" aria-hidden="true" />
          )}
          {submitting ? "Submitting…" : "Submit assessment"}
        </Button>
      ) : (
        <Button type="button" onClick={handleNext} disabled={submitting} className={mobile ? "flex-1" : undefined}>
          Continue
          <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </Button>
      )}
    </div>
  )

  return (
    <div className="flex min-w-0 flex-col gap-6 pb-20 md:pb-0">
      {activeDemoScenario && (
        <div role="status" className="flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-950 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="font-semibold">Demonstration data — not a real patient record</p>
              <p className="mt-0.5 text-sm text-amber-800">Loaded scenario: {activeDemoScenario}</p>
            </div>
          </div>
          <Button type="button" variant="outline" onClick={handleReset} disabled={submitting} className="min-h-11 shrink-0 border-amber-400 bg-transparent text-amber-950 hover:bg-amber-100">
            Clear demo data
          </Button>
        </div>
      )}

      <div className="lg:hidden">
        <Stepper steps={STEPS} currentIndex={stepIndex} furthestIndex={furthestIndex} onStepSelect={handleStepSelect} />
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[12rem_minmax(0,1fr)_14rem] xl:grid-cols-[13rem_minmax(0,1fr)_16rem]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <Stepper
              steps={STEPS}
              currentIndex={stepIndex}
              furthestIndex={furthestIndex}
              onStepSelect={handleStepSelect}
              variant="vertical"
            />
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-4">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>
                <span ref={headingRef} tabIndex={-1} className="outline-none">
                  {meta.title}
                </span>
              </CardTitle>
              <CardDescription>{meta.description}</CardDescription>
            </CardHeader>
            <CardContent className="min-w-0 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentStep.id}
                  initial={reduceMotion ? false : { opacity: 0, x: direction * 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: direction * -20 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  {currentStep.id === "patient" && <PatientStep value={input.patient} errors={errors} onChange={(patch) => updateSection("patient", patch)} />}
                  {currentStep.id === "oral" && <OralStep value={input.oral} errors={errors} onChange={(patch) => updateSection("oral", patch)} />}
                  {currentStep.id === "breast" && <BreastStep value={input.breast} errors={errors} onChange={(patch) => updateSection("breast", patch)} />}
                  {currentStep.id === "cervical" && <CervicalStep value={input.cervical} errors={errors} onChange={(patch) => updateSection("cervical", patch)} />}
                  {currentStep.id === "review" && <ReviewStep input={input} onEdit={handleStepSelect} />}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {error && (
            <div role="alert" className="rounded-lg border border-urgency-referral-border bg-urgency-referral-soft p-3.5 text-sm font-medium leading-relaxed text-urgency-referral">
              {error}
            </div>
          )}

          {submitting && (
            <p role="status" aria-live="polite" className="text-center text-sm font-medium text-muted">
              {SUBMISSION_MESSAGES[submissionMessageIndex]}
            </p>
          )}

          <div className="hidden md:block">{actionButtons()}</div>

          <div className="lg:hidden">
            <UtilityPanel
              activeDemoScenario={activeDemoScenario}
              submitting={submitting}
              onReset={handleReset}
              onLoadDemo={loadDemo}
            />
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <UtilityPanel
              activeDemoScenario={activeDemoScenario}
              submitting={submitting}
              onReset={handleReset}
              onLoadDemo={loadDemo}
            />
          </div>
        </aside>
      </div>

      <div className="sticky bottom-0 -mx-4 border-t border-border bg-background/95 px-4 py-3 shadow-lg backdrop-blur md:hidden">
        {actionButtons(true)}
      </div>
    </div>
  )
}
