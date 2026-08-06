"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { AssessmentPayload, AssessmentResponse } from "@/lib/assessment-types"
import { DEMO_SCENARIOS } from "@/lib/demo-scenarios"
import { createInitialAssessment } from "@/lib/initial-assessment"

type SectionKey = keyof AssessmentPayload
type ValidationState = Record<string, string>

interface AssessmentStore {
  assessment: AssessmentPayload
  /** Compatibility alias used by the existing questionnaire. */
  input: AssessmentPayload
  currentStep: number
  completedSteps: number[]
  result: AssessmentResponse | null
  validationState: ValidationState
  submitting: boolean
  error: string | null

  setNestedField: <S extends SectionKey, F extends keyof AssessmentPayload[S]>(
    section: S,
    field: F,
    value: AssessmentPayload[S][F],
  ) => void
  updateSection: <S extends SectionKey>(section: S, patch: Partial<AssessmentPayload[S]>) => void
  setCurrentStep: (step: number) => void
  markStepCompleted: (step: number) => void
  setValidationState: (validationState: ValidationState) => void
  clearValidationState: () => void
  resetAssessment: () => void
  loadDemoScenario: (scenarioId: string) => boolean
  saveLastResult: (result: AssessmentResponse) => void
  clearResult: () => void

  // Compatibility actions used by the existing questionnaire and results UI.
  loadInput: (input: AssessmentPayload) => void
  setResult: (result: AssessmentResponse | null) => void
  setSubmitting: (submitting: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialPayload = createInitialAssessment()

function freshState() {
  const assessment = createInitialAssessment()
  return {
    assessment,
    input: assessment,
    currentStep: 0,
    completedSteps: [],
    result: null,
    validationState: {},
    submitting: false,
    error: null,
  }
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set) => ({
      assessment: initialPayload,
      input: initialPayload,
      currentStep: 0,
      completedSteps: [],
      result: null,
      validationState: {},
      submitting: false,
      error: null,

      setNestedField: (section, field, value) =>
        set((state) => {
          const assessment = {
            ...state.assessment,
            [section]: { ...state.assessment[section], [field]: value },
          }
          return { assessment, input: assessment }
        }),
      updateSection: (section, patch) =>
        set((state) => {
          const assessment = {
            ...state.assessment,
            [section]: { ...state.assessment[section], ...patch },
          }
          return { assessment, input: assessment }
        }),
      setCurrentStep: (currentStep) => set({ currentStep }),
      markStepCompleted: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step].sort((a, b) => a - b),
        })),
      setValidationState: (validationState) => set({ validationState }),
      clearValidationState: () => set({ validationState: {} }),
      resetAssessment: () => set(freshState()),
      loadDemoScenario: (scenarioId) => {
        const scenario = DEMO_SCENARIOS.find((item) => item.id === scenarioId)
        if (!scenario) return false
        const assessment = structuredClone(scenario.input)
        set({
          assessment,
          input: assessment,
          currentStep: 0,
          completedSteps: [],
          result: null,
          validationState: {},
          error: null,
        })
        return true
      },
      saveLastResult: (result) => set({ result }),
      clearResult: () => set({ result: null }),

      loadInput: (input) => set({ assessment: input, input, result: null, error: null }),
      setResult: (result) => set({ result }),
      setSubmitting: (submitting) => set({ submitting }),
      setError: (error) => set({ error }),
      reset: () => set(freshState()),
    }),
    {
      name: "oasis.assessment.store.v1",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        assessment: state.assessment,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        result: state.result,
        validationState: state.validationState,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<AssessmentStore>
        const assessment = persisted.assessment ?? currentState.assessment
        return {
          ...currentState,
          ...persisted,
          assessment,
          input: assessment,
          submitting: false,
          error: null,
        }
      },
    },
  ),
)
