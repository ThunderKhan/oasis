"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { AssessmentPayload, AssessmentResponse } from "@/lib/assessment-types"
import { getDemoScenario, type DemoScenario } from "@/lib/demo-scenarios"
import { createInitialAssessment, generatePatientCode } from "@/lib/initial-assessment"

type SectionKey = keyof AssessmentPayload

interface AssessmentStore {
  assessment: AssessmentPayload
  currentStep: number
  completedSteps: number[]
  result: AssessmentResponse | null
  resultTimestamp: string | null
  activeDemoScenarioId: DemoScenario["id"] | null
  submitting: boolean
  error: string | null
  hydrated: boolean
  updateSection: <S extends SectionKey>(section: S, patch: Partial<AssessmentPayload[S]>) => void
  setCurrentStep: (step: number) => void
  markStepCompleted: (step: number) => void
  setSubmitting: (submitting: boolean) => void
  setError: (error: string | null) => void
  setHydrated: (hydrated: boolean) => void
  ensurePatientCode: () => void
  startFreshAssessment: () => void
  loadDemoScenario: (scenarioId: DemoScenario["id"]) => boolean
  saveResult: (result: AssessmentResponse, timestamp: string) => void
  clearResult: () => void
}

function freshAssessment(): AssessmentPayload {
  const assessment = createInitialAssessment()
  assessment.patient.patient_code = generatePatientCode()
  return assessment
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set) => ({
      assessment: createInitialAssessment(),
      currentStep: 0,
      completedSteps: [],
      result: null,
      resultTimestamp: null,
      activeDemoScenarioId: null,
      submitting: false,
      error: null,
      hydrated: false,
      updateSection: (section, patch) =>
        set((state) => ({
          assessment: {
            ...state.assessment,
            [section]: { ...state.assessment[section], ...patch },
          },
        })),
      setCurrentStep: (currentStep) => set({ currentStep }),
      markStepCompleted: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step].sort((a, b) => a - b),
        })),
      setSubmitting: (submitting) => set({ submitting }),
      setError: (error) => set({ error }),
      setHydrated: (hydrated) => set({ hydrated }),
      ensurePatientCode: () =>
        set((state) =>
          state.assessment.patient.patient_code
            ? state
            : {
                assessment: {
                  ...state.assessment,
                  patient: {
                    ...state.assessment.patient,
                    patient_code: generatePatientCode(),
                  },
                },
              },
        ),
      startFreshAssessment: () =>
        set({
          assessment: freshAssessment(),
          currentStep: 0,
          completedSteps: [],
          result: null,
          resultTimestamp: null,
          activeDemoScenarioId: null,
          submitting: false,
          error: null,
        }),
      loadDemoScenario: (scenarioId) => {
        const scenario = getDemoScenario(scenarioId)
        if (!scenario) return false

        set({
          assessment: structuredClone(scenario.input),
          currentStep: 0,
          completedSteps: [],
          result: null,
          resultTimestamp: null,
          activeDemoScenarioId: scenarioId,
          error: null,
        })
        return true
      },
      saveResult: (result, resultTimestamp) =>
        set({ result, resultTimestamp, submitting: false, error: null }),
      clearResult: () => set({ result: null, resultTimestamp: null }),
    }),
    {
      name: "oasis.assessment.store.v2",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        assessment: state.assessment,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        result: state.result,
        resultTimestamp: state.resultTimestamp,
        activeDemoScenarioId: state.activeDemoScenarioId,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
)
