import type {
  AssessmentInput,
  AssessmentResponse,
  AssessmentSummary,
  HealthResponse,
} from "./assessment-types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export class ApiError extends Error {
  status: number
  detail: unknown

  constructor(status: number, detail: unknown) {
    super(typeof detail === "string" ? detail : `Request failed with status ${status}`)
    this.name = "ApiError"
    this.status = status
    this.detail = detail
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new ApiError(res.status, data?.detail ?? data)
  }
  return data as T
}

export function createAssessment(input: AssessmentInput): Promise<AssessmentResponse> {
  return request<AssessmentResponse>("/api/v1/assessments", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export function listAssessments(): Promise<AssessmentSummary[]> {
  return request<AssessmentSummary[]>("/api/v1/assessments")
}

export function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health")
}