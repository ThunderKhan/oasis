"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  ShieldCheck,
} from "lucide-react"
import { AssessmentActions } from "@/components/assessment/AssessmentActions"
import { AssessmentShell } from "@/components/assessment/AssessmentShell"
import { DemoScenarioPicker } from "@/components/assessment/DemoScenarioPicker"
import { PatientStep } from "@/components/assessment/PatientStep"
import { OralStep } from "@/components/assessment/OralStep"
import { BreastStep } from "@/components/assessment/BreastStep"
import { CervicalStep } from "@/components/assessment/CervicalStep"
import { ReviewStep } from "@/components/assessment/ReviewStep"
import { SectionHeading } from "@/components/assessment/SectionHeading"
import {
  MobileStepProgress,
  StepNavigation,
  type AssessmentStep,
} from "@/components/assessment/StepNavigation"
import { ValidationSummary } from "@/components/assessment/ValidationSummary"
import { Card } from "@/components/ui/card"
import { ApiError, createAssessment } from "@/lib/api"
import type { AssessmentInput } from "@/lib/assessment-types"
import { DEMO_SCENARIOS } from "@/lib/demo-scenarios"
import { generatePatientCode } from "@/lib/initial-assessment"
import {
  clearSavedAssessment,
  loadSavedInput,
  loadSavedStep,
  saveInput,
  saveResult,
  saveResultTimestamp,
  saveStep,
} from "@/lib/session-persistence"
import { validateSection, type FieldErrors } from "@/lib/validation"
import { useAssessmentStore } from "@/stores/assessment-store"

const STEPS: AssessmentStep[] = [
  { id: "patient", label: "Patient Details", help: "Identity, eligibility, consent" },
  { id: "oral", label: "Oral Assessment", help: "History, exposure, symptoms" },
  { id: "breast", label: "Breast Assessment", help: "Screening and symptoms" },
  { id: "cervical", label: "Cervical Assessment", help: "History and follow-up" },
  { id: "review", label: "Review", help: "Check all responses" },
  { id: "submit", label: "Submit", help: "Confirm and classify" },
]

const STEP_META: Record<string, { title: string; description: string }> = {
  patient: {
    title: "Patient details",
    description:
      "Record only the minimum de-identified information needed to determine screening eligibility.",
  },
  oral: {
    title: "Oral assessment",
    description:
      "Document screening history, relevant exposures, and current oral warning symptoms.",
  },
  breast: {
    title: "Breast assessment",
    description:
      "Review screening history, current breast symptoms, and relevant family or clinical history.",
  },
  cervical: {
    title: "Cervical assessment",
    description:
      "Document screening history, warning symptoms, and optional risk information.",
  },
  review: {
    title: "Review assessment",
    description:
      "Check the recorded information and return to any section that needs correction.",
  },
  submit: {
    title: "Submit assessment",
    description:
      "Confirm the de-identified record is complete before requesting priority classification.",
  },
}

const SUBMISSION_MESSAGES = [
  "Reviewing screening eligibility",
  "Checking clinical safety rules",
  "Preparing explainable recommendation",
]

interface UtilityRailProps {
  currentIndex: number
  activeDemoScenario: string | null
  submitting: boolean
  onReset: () => void
  onLoadDemo: (id: string) => void
}

function UtilityRail({
  currentIndex,
  activeDemoScenario,
  submitting,
  onReset,
  onLoadDemo,
}: UtilityRailProps) {
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-xl border border-border bg-surface p-4">
        <div className="flex items-start gap-2.5">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-primary"
          />
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-foreground">Privacy reminder</h3>
            <p className="text-xs leading-relaxed text-muted">
              Progress stays in this browser session. Use only de-identified patient
              information.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs font-medium text-muted">
          <span>Overall progress</span>
          <span>
            {currentIndex + 1} / {STEPS.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </section>

      <DemoScenarioPicker
        activeScenario={activeDemoScenario}
        disabled={submitting}
        onLoad={onLoadDemo}
        onBlank={onReset}
      />

      <section className="rounded-xl border border-border bg-surface p-4">
        <h3 className="text-sm font-semibold text-foreground">Clinical scope</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          This tool supports screening and referral decisions. It does not replace
          clinical judgment, examination, or diagnostic testing.
        </p>
      </section>
    </div>
  )
}

function SubmitConfirmation({ input }: { input: AssessmentInput }) {
  const applicablePathways = [
    "Oral",
    input.breast.applicable && "Breast",
    input.cervical.applicable && "Cervical",
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3 rounded-lg border border-primary/25 bg-primary-soft p-4">
        <ClipboardCheck
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-primary"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground">
            Ready for priority classification
          </p>
          <p className="text-sm leading-relaxed text-muted">
            The assessment will be submitted for decision support. The result is not
            a diagnosis and does not exclude cancer.
          </p>
        </div>
      </div>

      <dl className="grid gap-3 rounded-lg border border-border bg-background p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs font-medium text-muted">Patient code</dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">
            {input.patient.patient_code}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted">Age</dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">
            {input.patient.age} years
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted">Applicable pathways</dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">
            {applicablePathways}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted">Consent</dt>
          <dd className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-primary">
            <CheckCircle2 aria-hidden="true" className="size-4" />
            Confirmed
          </dd>
        </div>
      </dl>

      <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4">
        <ShieldCheck
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-primary"
        />
        <p className="text-sm leading-relaxed text-foreground">
          By submitting, you confirm that the information has been reviewed and that
          O.A.S.I.S. is being used as decision support rather than a diagnostic tool.
        </p>
      </div>
    </div>
  )
}

export function AssessmentWizard() {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const {
    input,
    updateSection,
    loadInput,
    setResult,
    submitting,
    setSubmitting,
    error,
    setError,
    reset,
  } = useAssessmentStore()

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
  const meta = STEP_META[currentStep.id]

  const validateAllSections = () => {
    for (const section of ["patient", "oral", "breast", "cervical"] as const) {
      const sectionErrors = validateSection(section, input[section])

      if (Object.keys(sectionErrors).length > 0) {
        goTo(
          STEPS.findIndex((step) => step.id === section),
          -1,
        )
        setErrors(sectionErrors)
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    setError(null)

    if (["patient", "oral", "breast", "cervical"].includes(currentStep.id)) {
      const section = currentStep.id as keyof AssessmentInput
      const sectionErrors = validateSection(section, input[section])

      if (Object.keys(sectionErrors).length > 0) {
        setErrors(sectionErrors)
        return
      }
    }

    if (currentStep.id === "review" && !validateAllSections()) return

    const nextIndex = Math.min(stepIndex + 1, STEPS.length - 1)
    setFurthestIndex((current) => Math.max(current, nextIndex))
    goTo(nextIndex, 1)
  }

  const handleBack = () => {
    setError(null)
    goTo(Math.max(stepIndex - 1, 0), -1)
  }

  const handleStepSelect = (index: number) => {
    if (!submitting && index <= furthestIndex) {
      goTo(index, index >= stepIndex ? 1 : -1)
    }
  }

  const handleSubmit = async () => {
    if (submitting) return

    setError(null)
    if (!validateAllSections()) return

    setSubmitting(true)

    try {
      const result = await createAssessment(input)
      setResult(result)
      saveResult(result)
      saveResultTimestamp(new Date().toISOString())
      clearSavedAssessment()
      router.push("/results")
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        setError(caughtError.message)
      } else {
        setError(
          "The assessment could not be submitted. Check the connection and try again; your entered data has been preserved.",
        )
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
    setActiveDemoScenario(scenario.label.replace(/^Demo [A-C]: /, ""))
    setFurthestIndex(0)
    setErrors({})
    goTo(0, -1)
  }

  const actions = (mobile = false) => {
    const isSubmitStep = currentStep.id === "submit"

    return (
      <AssessmentActions
        backDisabled={stepIndex === 0}
        submitting={submitting}
        primaryLabel={
          isSubmitStep
            ? "Generate Screening Recommendation"
            : currentStep.id === "review"
              ? "Continue to submit"
              : "Continue"
        }
        submit={isSubmitStep}
        mobile={mobile}
        onBack={handleBack}
        onPrimary={isSubmitStep ? handleSubmit : handleNext}
      />
    )
  }

  const utility = (
    <UtilityRail
      currentIndex={stepIndex}
      activeDemoScenario={activeDemoScenario}
      submitting={submitting}
      onReset={handleReset}
      onLoadDemo={loadDemo}
    />
  )

  return (
    <div className="flex flex-col gap-5">
      {activeDemoScenario && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-lg border border-urgency-priority-border bg-urgency-priority-soft p-4 text-urgency-priority"
        >
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">
              Demonstration data — not a real patient record
            </p>
            <p className="mt-0.5 text-xs">Loaded scenario: {activeDemoScenario}</p>
          </div>
        </div>
      )}

      <AssessmentShell
        navigation={
          <StepNavigation
            steps={STEPS}
            currentIndex={stepIndex}
            furthestIndex={furthestIndex}
            onSelect={handleStepSelect}
            disabled={submitting}
          />
        }
        mobileProgress={
          <MobileStepProgress steps={STEPS} currentIndex={stepIndex} />
        }
        utilityRail={utility}
        mobileActions={actions(true)}
      >
        <div className="flex min-w-0 flex-col gap-4">
          <Card className="min-w-0 overflow-hidden">
            <SectionHeading
              ref={headingRef}
              eyebrow={`Step ${stepIndex + 1} of ${STEPS.length}`}
              title={meta.title}
              description={meta.description}
            />

            <div className="min-w-0 p-5 md:p-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentStep.id}
                  initial={
                    reduceMotion ? false : { opacity: 0, x: direction * 14 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  exit={
                    reduceMotion
                      ? undefined
                      : { opacity: 0, x: direction * -14 }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex flex-col gap-5"
                >
                  <ValidationSummary errors={errors} />

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

                  {currentStep.id === "review" && (
                    <ReviewStep input={input} onEdit={handleStepSelect} />
                  )}

                  {currentStep.id === "submit" && (
                    <SubmitConfirmation input={input} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-urgency-referral-border bg-urgency-referral-soft p-4 text-sm font-medium leading-relaxed text-urgency-referral"
            >
              {error}
            </div>
          )}

          {submitting && (
            <p
              role="status"
              aria-live="polite"
              className="flex items-center justify-center gap-2 text-sm font-medium text-muted"
            >
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              {SUBMISSION_MESSAGES[submissionMessageIndex]}
            </p>
          )}

          <div className="hidden md:block">{actions()}</div>
          <div className="2xl:hidden">{utility}</div>
        </div>
      </AssessmentShell>
    </div>
  )
}
