"use client";

import { cn } from "@/lib/utils";

const backgroundStyles = {
  bone: "bg-bone text-black",
  white: "bg-white text-black",
  black: "bg-black text-bone",
  red: "bg-red text-bone",
} as const;

const paddingStyles = {
  large: "py-2xl md:py-3xl",
  small: "py-xl md:py-2xl",
  none: "py-0",
} as const;

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  background?: "bone" | "white" | "black" | "red";
  padding?: "large" | "small" | "none";
}

export function Section({
  children,
  className,
  background = "bone",
  padding = "large",
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn(
        "w-full",
        backgroundStyles[background],
        paddingStyles[padding],
        className
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
