"use client";

import { cn } from "@/lib/utils";

const paddingStyles = {
  default: "p-6",
  compact: "p-4",
  none: "p-0",
} as const;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: "default" | "compact" | "none";
}

export function Card({
  children,
  className,
  padding = "default",
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-card overflow-hidden shadow-none",
        paddingStyles[padding],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
