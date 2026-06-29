"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Call" trigger that opens a small dialog with the number and two (demo) actions,
 * instead of a raw tel: link — which on some machines is hijacked by apps like
 * Zoom. Built on native <dialog> for focus-trap/Esc/backdrop/aria-modal.
 */
export function CallDialog({ phone }: { phone: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:text-brand"
      >
        Call
      </button>

      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === ref.current) setOpen(false);
        }}
        aria-labelledby="call-title"
        className="print-hidden m-auto max-h-[90dvh] w-[min(92vw,24rem)] overflow-y-auto rounded-3xl bg-paper p-0 text-ink shadow-card backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
      >
        <div className="animate-pop p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 id="call-title" className="font-display text-xl font-semibold text-ink">
              Call Cardamom House
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:text-brand"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <p className="mt-1 text-sm text-ink-soft">
            We&rsquo;d love to hear from you.
          </p>

          <p className="mt-5 text-center font-display text-2xl font-semibold tabular-nums text-brand">
            {phone}
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-on-brand transition-transform hover:-translate-y-0.5"
            >
              Call now
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-full border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:text-brand"
            >
              Schedule later
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-ink-soft/70">
            Demo actions — not connected to a phone line.
          </p>
        </div>
      </dialog>
    </>
  );
}
