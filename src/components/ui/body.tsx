"use client";

import { cn } from "@/lib/utils";

const sizeStyles: Record<"large" | "standard" | "small", string> = {
  large: "text-body-lg-mobile md:text-body-lg font-tiempos-text",
  standard: "text-body-mobile md:text-body font-tiempos-text",
  small: "text-body-sm-mobile md:text-body-sm font-tiempos-text",
};

export interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "large" | "standard" | "small";
  children: React.ReactNode;
  className?: string;
}

export function Body({
  size = "standard",
  children,
  className,
  ...rest
}: BodyProps) {
  return (
    <p
      className={cn(sizeStyles[size], className)}
      {...rest}
    >
      {children}
    </p>
  );
}
