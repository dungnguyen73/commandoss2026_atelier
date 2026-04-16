import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  loading?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  disabled,
  children,
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base
        "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]/40",
        "disabled:pointer-events-none disabled:opacity-50",
        // Variants
        variant === "primary" && [
          "bg-primary-gradient text-white rounded-full",
          "shadow-[0px_4px_16px_rgba(0,110,47,0.25)]",
          "hover:shadow-[0px_6px_24px_rgba(0,110,47,0.35)] hover:-translate-y-px",
          "active:translate-y-0 active:shadow-none",
        ],
        variant === "default" && [
          "rounded-full bg-[var(--color-foreground)] text-[var(--color-background)]",
          "hover:opacity-90",
        ],
        variant === "secondary" && [
          "rounded-full bg-[var(--color-surface-low)] text-[var(--color-foreground)]",
          "hover:bg-[var(--color-surface-lowest)] hover:shadow-[var(--shadow-sm)]",
        ],
        variant === "outline" && [
          "rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]",
          "text-[var(--color-foreground)] hover:bg-[var(--color-surface-low)]",
        ],
        variant === "ghost" && [
          "rounded-xl text-[var(--color-foreground)]",
          "hover:bg-[var(--color-surface-low)]",
        ],
        // Sizes
        size === "sm" && "h-8 px-4 text-xs",
        size === "default" && "h-10 px-5",
        size === "lg" && "h-12 px-7 text-base",
        className,
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export { Button };
