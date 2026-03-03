"use client";

import { cn } from "@/lib/utils";

const colsStyles = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-4",
} as const;

const gapStyles = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
} as const;

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

export function Grid({
  children,
  className,
  cols = 1,
  gap = "md",
  ...rest
}: GridProps) {
  return (
    <div
      className={cn("grid", colsStyles[cols], gapStyles[gap], className)}
      {...rest}
    >
      {children}
    </div>
  );
}
