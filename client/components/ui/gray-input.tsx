import * as React from "react"
import { cn } from "@/lib/utils"

export interface GrayInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const GrayInput = React.forwardRef<HTMLInputElement, GrayInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-[#d1d5db] bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
GrayInput.displayName = "GrayInput"

export { GrayInput }