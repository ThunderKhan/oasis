import { cn } from "@/lib/utils"

interface OasisLogoProps {
  className?: string
}

/** Three screening pathways converging on a protected point of care. */
export function OasisLogo({ className }: OasisLogoProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 3 42 10v12c0 11-7.5 19.3-18 23C13.5 41.3 6 33 6 22V10L24 3Z"
        fill="currentColor"
      />
      <path d="M14 16.5 24 25m10-8.5L24 25M24 12v13" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="29" r="5.5" fill="white" />
      <circle cx="24" cy="29" r="2.5" fill="currentColor" />
    </svg>
  )
}
