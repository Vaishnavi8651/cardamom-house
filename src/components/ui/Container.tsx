import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  /** Extra classes for vertical spacing etc. — the width/padding are fixed here. */
  className?: string;
}

/**
 * The single source of truth for page width and horizontal gutters. Every
 * full-width band (hero, special, menu, footer) wraps its content in a Container
 * so the measure stays consistent and is retunable in one place.
 *
 * max-w-3xl (~48rem) is a deliberate reading measure: a menu is a column of
 * text, and a wider container would hurt scannability on desktop.
 */
export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={["mx-auto w-full max-w-3xl px-5 sm:px-6", className].join(" ")}>
      {children}
    </div>
  );
}
