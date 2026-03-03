"use client";

import { cn } from "@/lib/utils";

const levelStyles: Record<
  1 | 2 | 3 | 4 | 5 | 6,
  string
> = {
  1: "font-obviously-wide font-bold text-h1-mobile md:text-h1 lowercase",
  2: "font-obviously-wide font-semibold text-h2-mobile md:text-h2 lowercase",
  3: "font-obviously-wide font-semibold text-h3-mobile md:text-h3 lowercase",
  4: "font-obviously-wide font-medium text-h4-mobile md:text-h4 lowercase",
  5: "font-obviously-wide font-medium text-[20px] lowercase",
  6: "font-obviously-wide font-medium text-[16px] lowercase",
};

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
  as?: HeadingTag;
  children: React.ReactNode;
  className?: string;
}

const tagByLevel: Record<HeadingLevel, HeadingTag> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

export function Heading({
  level,
  as,
  children,
  className,
  ...rest
}: HeadingProps) {
  const Tag = as ?? tagByLevel[level];
  return (
    <Tag
      className={cn(levelStyles[level], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
