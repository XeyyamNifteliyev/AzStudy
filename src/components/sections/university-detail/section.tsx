import type { ReactNode } from "react";

/**
 * Shared heading wrapper for university detail sections. Kept in its own file
 * so every section component uses the same h2 + optional action layout.
 */
export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-headline-md text-foreground">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
