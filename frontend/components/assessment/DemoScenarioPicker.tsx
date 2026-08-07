import { FlaskConical, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEMO_SCENARIOS } from "@/lib/demo-scenarios"

type DemoScenarioId = (typeof DEMO_SCENARIOS)[number]["id"]

interface DemoScenarioPickerProps {
  activeScenario: string | null
  disabled?: boolean
  onLoad: (id: DemoScenarioId) => void
  onBlank: () => void
}

export function DemoScenarioPicker({
  activeScenario,
  disabled = false,
  onLoad,
  onBlank,
}: DemoScenarioPickerProps) {
  return (
    <section
      className="rounded-xl border border-border bg-surface p-4"
      aria-labelledby="demo-title"
    >
      <div className="flex items-start gap-2.5">
        <FlaskConical
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-clinical-blue"
        />
        <div>
          <h3
            id="demo-title"
            className="text-sm font-semibold text-foreground"
          >
            Demonstration data
          </h3>

          <p className="mt-1 text-xs leading-relaxed text-muted">
            Load a training scenario. Never use demo data for a real patient.
          </p>
        </div>
      </div>

      {activeScenario && (
        <p
          role="status"
          className="mt-3 rounded-md bg-clinical-blue-soft px-3 py-2 text-xs font-medium text-clinical-blue"
        >
          Loaded: {activeScenario}
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2">
        {DEMO_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => onLoad(scenario.id)}
            disabled={disabled}
            className="min-h-11 rounded-md border border-border bg-background px-3 py-2 text-left text-sm font-medium text-foreground outline-none transition-colors hover:border-primary hover:bg-primary-soft focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          >
            {scenario.label.replace(/^Demo [A-C]: /, "")}
          </button>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={onBlank}
          disabled={disabled}
          className="w-full"
        >
          <RotateCcw data-icon="inline-start" aria-hidden="true" />
          Blank Assessment
        </Button>
      </div>
    </section>
  )
}