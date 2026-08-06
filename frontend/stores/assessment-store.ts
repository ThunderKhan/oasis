"use client"

import { create } from "zustand"
import type { AssessmentInput, AssessmentResponse } from "@/lib/assessment-types"
import { createInitialAssessment } from "@/lib/initial-assessment"

type SectionKey = keyof AssessmentInput

interface AssessmentStore {
  /** Current in-progress form input */
  input: AssessmentInput
  /** Latest result returned by the backend */
  result: AssessmentResponse | null
  /** Submission state */
  submitting: boolean
  error: string | null

  updateSection: <K extends SectionKey>(section: K, patch: Partial<AssessmentInput[K]>) => void
  loadInput: (input: AssessmentInput) => void
  setResult: (result: AssessmentResponse | null) => void
  setSubmitting: (submitting: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  input: createInitialAssessment(),
  result: null,
  submitting: false,
  error: null,

  updateSection: (section, patch) =>
    set((state) => ({
      input: {
        ...state.input,
        [section]: { ...state.input[section], ...patch },
      },
    })),

  loadInput: (input) => set({ input, result: null, error: null }),
  setResult: (result) => set({ result }),
  setSubmitting: (submitting) => set({ submitting }),
  setError: (error) => set({ error }),
  reset: () =>
    set({ input: createInitialAssessment(), result: null, submitting: false, error: null }),
}))
