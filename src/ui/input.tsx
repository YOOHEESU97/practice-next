import type { InputHTMLAttributes } from "react";
import { cn } from "@/src/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none transition-shadow placeholder:text-[var(--color-foreground-muted)] focus-visible:border-[var(--color-brand)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/25",
        invalid && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/25",
        className,
      )}
      {...props}
    />
  );
}
