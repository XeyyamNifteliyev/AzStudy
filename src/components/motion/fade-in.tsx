"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  // SSR / no-JS safety (FE-2): content stays visible until JS actually mounts.
  // Before mount, no opacity-0 class is applied so the section renders. Once
  // mounted, the IntersectionObserver gates the animation as before.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el || shown) return;
    // UI-2: respect prefers-reduced-motion — no fade, content shows at once.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        mounted && !shown && "opacity-0",
        shown && "animate-fade-in-up",
        className,
      )}
    >
      {children}
    </div>
  );
}
