"use client";

import { cn } from "@/lib/utils";
import { Caption } from "./caption";

export interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
  className?: string;
}

export function Testimonial({
  quote,
  author,
  role,
  className,
}: TestimonialProps) {
  return (
    <blockquote className={cn("space-y-md", className)}>
      <p className="font-tiempos-headline font-medium text-pull-quote md:text-pull-quote-mobile leading-[1.4]">
        <span className="text-red">{"\u201C"}</span>
        {quote}
      </p>
      <footer>
        <p className="font-obviously font-medium text-[16px] lowercase text-black/55">
          {author}
        </p>
        {role != null && role !== "" && (
          <Caption className="mt-xs block">{role}</Caption>
        )}
      </footer>
    </blockquote>
  );
}
