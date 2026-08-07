import type {
  AssessmentHistoryResponse,
  AssessmentPayload,
  AssessmentResponse,
  HealthResponse,
} from "./assessment-types"

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "")
const DEFAULT_TIMEOUT_MS = 15_000
const ENDPOINTS = {
  assessments: "/api/v1/assessments",
  health: "/health",
} as const

interface ValidationIssue {
  loc?: Array<string | number>
  msg?: string
  type?: string
}

interface RequestOptions extends RequestInit {
  timeoutMs?: number
}

export class ApiError extends Error {
  readonly status: number
  readonly detail: unknown
  readonly validationErrors: string[]

  constructor(message: string, status = 0, detail: unknown = null, validationErrors: string[] = []) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.detail = detail
    this.validationErrors = validationErrors
  }
}

function validationMessages(detail: unknown): string[] {
  if (!Array.isArray(detail)) return []

  return detail.flatMap((issue: ValidationIssue) => {
    if (!issue || typeof issue.msg !== "string") return []
    const field = issue.loc?.filter((part) => part !== "body").join(".")
    return field ? `${field}: ${issue.msg}` : issue.msg
  })
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    throw new ApiError("The assessment service returned an unreadable response.", response.status, text)
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController()
  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal: externalSignal, ...init } = options
  const abortFromExternalSignal = () => controller.abort(externalSignal?.reason)

  if (externalSignal?.aborted) abortFromExternalSignal()
  else externalSignal?.addEventListener("abort", abortFromExternalSignal, { once: true })

  const timeout = globalThis.setTimeout(
    () => controller.abort(new DOMException("Request timed out", "TimeoutError")),
    timeoutMs,
  )

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    })
    const data = await parseResponseBody(response)

    if (!response.ok) {
      const detail = data && typeof data === "object" && "detail" in data ? data.detail : data
      const errors = validationMessages(detail)
      const message = errors.length
        ? `Please correct the following fields: ${errors.join("; ")}`
        : typeof detail === "string"
          ? detail
          : `The assessment service returned status ${response.status}.`
      throw new ApiError(message, response.status, detail, errors)
    }

    return data as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (controller.signal.aborted) {
      const timedOut = controller.signal.reason instanceof DOMException && controller.signal.reason.name === "TimeoutError"
      throw new ApiError(
        timedOut ? "The assessment service took too long to respond. Please try again." : "The request was cancelled.",
      )
    }
    throw new ApiError(
      "Unable to reach the assessment service. Check your connection and try again; no assessment was submitted.",
      0,
      error,
    )
  } finally {
    globalThis.clearTimeout(timeout)
    externalSignal?.removeEventListener("abort", abortFromExternalSignal)
  }
}

export function createAssessment(
  payload: AssessmentPayload,
  options?: RequestOptions,
): Promise<AssessmentResponse> {
  return request<AssessmentResponse>(ENDPOINTS.assessments, {
    ...options,
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getAssessments(options?: RequestOptions): Promise<AssessmentHistoryResponse> {
  return request<AssessmentHistoryResponse>(ENDPOINTS.assessments, options)
}

export function getHealth(options?: RequestOptions): Promise<HealthResponse> {
  return request<HealthResponse>(ENDPOINTS.health, options)
}
