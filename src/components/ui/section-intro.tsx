"use client";

import { cn } from "@/lib/utils";
import { Heading } from "./heading";
import { Body } from "./body";
import { Caption } from "./caption";

export interface SectionIntroProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionIntro({
  eyebrow,
  heading,
  description,
  align = "left",
  className,
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        "space-y-xs",
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow != null && eyebrow !== "" && (
        <Caption className="block text-red">{eyebrow}</Caption>
      )}
      <Heading level={2} className={align === "center" ? "mx-auto" : undefined}>
        {heading}
      </Heading>
      {description != null && description !== "" && (
        <Body
          size="large"
          className={cn(
            "max-w-narrow",
            align === "center" ? "mx-auto" : ""
          )}
        >
          {description}
        </Body>
      )}
    </div>
  );
}
