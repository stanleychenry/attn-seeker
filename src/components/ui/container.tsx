"use client";

import { cn } from "@/lib/utils";

const widthStyles = {
  narrow: "max-w-narrow",
  content: "max-w-content",
  standard: "max-w-standard",
  wide: "max-w-wide",
  full: "max-w-full",
} as const;

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  width?: "narrow" | "content" | "standard" | "wide" | "full";
}

export function Container({
  children,
  className,
  width = "standard",
  ...rest
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto px-sm", widthStyles[width], className)}
      {...rest}
    >
      {children}
    </div>
  );
}
