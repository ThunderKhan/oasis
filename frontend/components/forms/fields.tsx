"use client"

import { useId, type ReactNode, type SelectHTMLAttributes } from "react"
import { AlertOctagon } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Shared form primitives for the assessment wizard.
 * Every control renders a visible label, hint, and inline error;
 * red-flag questions get prominent non-colour-only treatment.
 */

interface FieldShellProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: (ids: { inputId: string; describedBy: string | undefined }) => ReactNode
}

function FieldShell({ label, hint, error, required, children }: FieldShellProps) {
  const inputId = useId()
  const hintId = useId()
  const errorId = useId()
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
        {required && (
          <span aria-hidden="true" className="text-urgency-referral">
            {" *"}
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-xs leading-relaxed text-muted">
          {hint}
        </p>
      )}
      {children({ inputId, describedBy })}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-urgency-referral">
          {error}
        </p>
      )}
    </div>
  )
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  error?: string
  required?: boolean
  placeholder?: string
  maxLength?: number
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  error,
  required,
  placeholder,
  maxLength,
}: TextFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      {({ inputId, describedBy }) => (
        <input
          id={inputId}
          type="text"
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-10 rounded-lg border bg-surface px-3 text-sm text-foreground placeholder:text-subtle",
            error ? "border-urgency-referral" : "border-border-strong",
          )}
        />
      )}
    </FieldShell>
  )
}

interface NumberFieldProps {
  label: string
  value: number | null
  onChange: (value: number | null) => void
  hint?: string
  error?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
  /** When false, an empty input maps to null instead of 0 */
  emptyAsZero?: boolean
}

export function NumberField({
  label,
  value,
  onChange,
  hint,
  error,
  required,
  min,
  max,
  step = 1,
  emptyAsZero = false,
}: NumberFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      {({ inputId, describedBy }) => (
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          value={value === null ? "" : value}
          min={min}
          max={max}
          step={step}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          onChange={(e) => {
            const raw = e.target.value
            if (raw === "") {
              onChange(emptyAsZero ? 0 : null)
              return
            }
            const parsed = Number(raw)
            onChange(Number.isNaN(parsed) ? null : parsed)
          }}
          className={cn(
            "h-10 w-32 rounded-lg border bg-surface px-3 text-sm tabular-nums text-foreground",
            error ? "border-urgency-referral" : "border-border-strong",
          )}
        />
      )}
    </FieldShell>
  )
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  hint?: string
  error?: string
  required?: boolean
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
  error,
  required,
}: SelectFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} required={required}>
      {({ inputId, describedBy }) => (
        <select
          id={inputId}
          value={value}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-10 w-full max-w-xs rounded-lg border bg-surface px-3 text-sm text-foreground",
            error ? "border-urgency-referral" : "border-border-strong",
          )}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  )
}

interface YesNoFieldProps {
  label: string
  value: boolean | null
  onChange: (value: boolean) => void
  hint?: string
  error?: string
  /** Marks a red-flag question — rendered with prominent treatment */
  redFlag?: boolean
  /** Allow a third "unknown" answer mapping to null */
  allowUnknown?: boolean
  onUnknown?: () => void
}

export function YesNoField({
  label,
  value,
  onChange,
  hint,
  error,
  redFlag,
  allowUnknown,
  onUnknown,
}: YesNoFieldProps) {
  const groupId = useId()
  const hintId = useId()

  const options: { label: string; selected: boolean; onSelect: () => void }[] = [
    { label: "Yes", selected: value === true, onSelect: () => onChange(true) },
    { label: "No", selected: value === false, onSelect: () => onChange(false) },
  ]
  if (allowUnknown) {
    options.push({
      label: "Unknown",
      selected: value === null,
      onSelect: () => onUnknown?.(),
    })
  }

  return (
    <div
      role="radiogroup"
      aria-labelledby={groupId}
      aria-describedby={hint ? hintId : undefined}
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        redFlag
          ? value === true
            ? "border-urgency-referral-border bg-urgency-referral-soft"
            : "border-border-strong bg-surface"
          : "border-border bg-surface",
      )}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span id={groupId} className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          {redFlag && (
            <AlertOctagon
              aria-hidden="true"
              className="size-4 shrink-0 text-urgency-referral"
            />
          )}
          {label}
          {redFlag && <span className="sr-only">(red-flag symptom)</span>}
        </span>
        {hint && (
          <span id={hintId} className="text-xs leading-relaxed text-muted">
            {hint}
          </span>
        )}
        {error && (
          <span role="alert" className="text-xs font-medium text-urgency-referral">
            {error}
          </span>
        )}
      </div>
      <div className="flex shrink-0 gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            role="radio"
            aria-checked={opt.selected}
            onClick={opt.onSelect}
            className={cn(
              "h-8 rounded-md border px-3.5 text-sm font-medium transition-colors",
              opt.selected
                ? redFlag && opt.label === "Yes"
                  ? "border-urgency-referral bg-urgency-referral text-white"
                  : "border-primary bg-primary text-primary-foreground"
                : "border-border-strong bg-surface text-muted hover:bg-primary-soft hover:text-primary",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

interface CheckboxFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: string
  error?: string
}

export function CheckboxField({ label, checked, onChange, hint, error }: CheckboxFieldProps) {
  const inputId = useId()
  const hintId = useId()
  const errorId = useId()
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-2.5">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-border-strong"
        />
        <label htmlFor={inputId} className="text-sm leading-relaxed text-foreground">
          {label}
        </label>
      </div>
      {hint && (
        <p id={hintId} className="pl-6 text-xs leading-relaxed text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="pl-6 text-xs font-medium text-urgency-referral">
          {error}
        </p>
      )}
    </div>
  )
}

/** Groups related questions under a small uppercase heading. */
export function FieldGroup({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <fieldset className="flex flex-col gap-3 border-0 p-0">
      <legend className="mb-1 flex flex-col gap-0.5 p-0">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</span>
        {description && <span className="text-xs leading-relaxed text-subtle">{description}</span>}
      </legend>
      {children}
    </fieldset>
  )
}
