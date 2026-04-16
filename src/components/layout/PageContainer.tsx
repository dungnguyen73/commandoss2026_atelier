import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  narrow?: boolean;
}

export function PageContainer({
  className,
  narrow = false,
  children,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-8 sm:px-6 md:py-12",
        narrow ? "max-w-2xl" : "max-w-5xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
