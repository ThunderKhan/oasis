"use client"

import { useId, type ReactNode, type SelectHTMLAttributes } from "react"
import { AlertOctagon } from "lucide-react"
import { cn } from "@/lib/utils"

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
    <div className="flex min-w-0 flex-col gap-1.5">
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
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "min-h-11 w-full rounded-lg border bg-surface px-3 text-sm text-foreground outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
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
          onChange={(event) => {
            const raw = event.target.value
            if (raw === "") {
              onChange(emptyAsZero ? 0 : null)
              return
            }
            const parsed = Number(raw)
            onChange(Number.isNaN(parsed) ? null : parsed)
          }}
          className={cn(
            "min-h-11 w-full max-w-40 rounded-lg border bg-surface px-3 text-sm tabular-nums text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
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
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "min-h-11 w-full max-w-xs rounded-lg border bg-surface px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            error ? "border-urgency-referral" : "border-border-strong",
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  )
}

interface RadioCardFieldProps<T extends string> {
  label: string
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string; description?: string }[]
  hint?: string
  error?: string
  required?: boolean
}

export function RadioCardField<T extends string>({
  label,
  value,
  onChange,
  options,
  hint,
  error,
  required,
}: RadioCardFieldProps<T>) {
  const name = useId()
  const legendId = useId()
  const hintId = useId()
  const errorId = useId()
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined

  return (
    <fieldset className="flex min-w-0 flex-col gap-2 border-0 p-0" aria-describedby={describedBy}>
      <legend id={legendId} className="text-sm font-medium text-foreground">
        {label}
        {required && (
          <span aria-hidden="true" className="text-urgency-referral">
            {" *"}
          </span>
        )}
      </legend>
      {hint && (
        <p id={hintId} className="text-xs leading-relaxed text-muted">
          {hint}
        </p>
      )}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const inputId = `${name}-${option.value}`
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={cn(
                "flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
                value === option.value
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border-strong bg-surface text-foreground hover:border-primary",
              )}
            >
              <input
                id={inputId}
                name={name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                aria-invalid={error ? true : undefined}
                onChange={() => onChange(option.value)}
                className="size-4 shrink-0 accent-primary"
              />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-medium">{option.label}</span>
                {option.description && (
                  <span className="text-xs leading-relaxed text-muted">{option.description}</span>
                )}
              </span>
            </label>
          )
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-urgency-referral">
          {error}
        </p>
      )}
    </fieldset>
  )
}

interface YesNoFieldProps {
  label: string
  value: boolean | null
  onChange: (value: boolean) => void
  hint?: string
  error?: string
  redFlag?: boolean
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
  const groupName = useId()
  const labelId = useId()
  const hintId = useId()
  const errorId = useId()
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined
  const options = [
    { label: "Yes", value: "yes", selected: value === true, onSelect: () => onChange(true) },
    { label: "No", value: "no", selected: value === false, onSelect: () => onChange(false) },
    ...(allowUnknown
      ? [{ label: "Unknown", value: "unknown", selected: value === null, onSelect: () => onUnknown?.() }]
      : []),
  ]

  return (
    <fieldset
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        redFlag && value === true
          ? "border-urgency-referral-border bg-urgency-referral-soft"
          : redFlag
            ? "border-border-strong bg-surface"
            : "border-border bg-surface",
      )}
    >
      <legend className="sr-only">{label}</legend>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span id={labelId} className="flex items-start gap-1.5 text-sm font-medium text-foreground">
          {redFlag && <AlertOctagon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-urgency-referral" />}
          <span>{label}</span>
          {redFlag && <span className="sr-only">(red-flag symptom)</span>}
        </span>
        {hint && (
          <span id={hintId} className="text-xs leading-relaxed text-muted">
            {hint}
          </span>
        )}
        {error && (
          <span id={errorId} role="alert" className="text-xs font-medium text-urgency-referral">
            {error}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-wrap gap-1.5">
        {options.map((option) => {
          const inputId = `${groupName}-${option.value}`
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={cn(
                "flex min-h-11 cursor-pointer items-center rounded-md border px-3.5 text-sm font-medium transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
                option.selected
                  ? redFlag && option.value === "yes"
                    ? "border-urgency-referral bg-urgency-referral text-white"
                    : "border-primary bg-primary text-primary-foreground"
                  : "border-border-strong bg-surface text-muted hover:bg-primary-soft hover:text-primary",
              )}
            >
              <input
                id={inputId}
                name={groupName}
                type="radio"
                value={option.value}
                checked={option.selected}
                aria-invalid={error ? true : undefined}
                onChange={option.onSelect}
                className="sr-only"
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </fieldset>
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
    <div className="flex min-w-0 flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="flex min-h-11 cursor-pointer items-start gap-2.5 rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
      >
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 size-5 shrink-0 rounded border-border-strong accent-primary"
        />
        <span className="text-sm leading-relaxed text-foreground">{label}</span>
      </label>
      {hint && (
        <p id={hintId} className="pl-8 text-xs leading-relaxed text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="pl-8 text-xs font-medium text-urgency-referral">
          {error}
        </p>
      )}
    </div>
  )
}

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
    <fieldset className="flex min-w-0 flex-col gap-3 border-0 p-0">
      <legend className="mb-1 flex flex-col gap-0.5 p-0">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</span>
        {description && <span className="text-xs leading-relaxed text-subtle">{description}</span>}
      </legend>
      {children}
    </fieldset>
  )
}
