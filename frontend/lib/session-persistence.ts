import type { AssessmentInput, AssessmentResponse } from "./assessment-types"

/**
 * sessionStorage persistence for the in-progress assessment and the latest
 * result. Session-scoped by design: nothing survives closing the tab, and
 * no identifying data is ever stored (the intake never collects any).
 */

const INPUT_KEY = "oasis.assessment.input.v1"
const STEP_KEY = "oasis.assessment.step.v1"
const RESULT_KEY = "oasis.assessment.result.v1"
const RESULT_TIME_KEY = "oasis.assessment.result-time.v1"

function safeGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable — persistence is best-effort only.
  }
}

function safeRemove(key: string) {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.removeItem(key)
  } catch {
    // Ignore.
  }
}

export function loadSavedInput(): AssessmentInput | null {
  return safeGet<AssessmentInput>(INPUT_KEY)
}

export function saveInput(input: AssessmentInput) {
  safeSet(INPUT_KEY, input)
}

export function loadSavedStep(): number | null {
  return safeGet<number>(STEP_KEY)
}

export function saveStep(step: number) {
  safeSet(STEP_KEY, step)
}

export function loadSavedResult(): AssessmentResponse | null {
  return safeGet<AssessmentResponse>(RESULT_KEY)
}

export function saveResult(result: AssessmentResponse) {
  safeSet(RESULT_KEY, result)
}

export function loadSavedResultTimestamp(): string | null {
  return safeGet<string>(RESULT_TIME_KEY)
}

export function saveResultTimestamp(timestamp: string) {
  safeSet(RESULT_TIME_KEY, timestamp)
}

export function clearSavedAssessment() {
  safeRemove(INPUT_KEY)
  safeRemove(STEP_KEY)
}

export function clearSavedResult() {
  safeRemove(RESULT_KEY)
  safeRemove(RESULT_TIME_KEY)
}
