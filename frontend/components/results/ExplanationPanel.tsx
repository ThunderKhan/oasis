import type { CancerAssessment } from "@/lib/assessment-types"

export function ExplanationPanel({ result }: { result: CancerAssessment }) {
  return (
    <details className="rounded-lg border border-border bg-background p-3 text-sm">
      <summary className="cursor-pointer font-medium text-muted">Technical details</summary>
      <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3">
        <p><span className="font-medium">Model version:</span> {result.model_version}</p>
        {result.reasons.some((reason) => reason.evidence_key) && (
          <div className="flex flex-col gap-1">
            <p className="font-medium">Evidence keys</p>
            <ul className="flex flex-col gap-1 text-xs text-muted">
              {result.reasons.filter((reason) => reason.evidence_key).map((reason) => (
                <li key={`${reason.factor}-${reason.evidence_key}`}><span className="text-foreground">{reason.factor}:</span> {reason.evidence_key}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  )
}
