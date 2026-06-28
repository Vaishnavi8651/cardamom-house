"use client";

import { useEffect, useRef, useState } from "react";
import { useOrder } from "./OrderProvider";
import { formatPrice } from "@/lib/formatPrice";

/**
 * Floating "Your picks" pill + a drawer listing the chosen items. The picks are
 * a local, client-only convenience (see OrderProvider) — explicitly not an order.
 * The drawer uses native <dialog> for focus management and Esc-to-close.
 */
export function OrderBar() {
  const { lines, count, total, remove, clear } = useOrder();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // If everything is removed while open, close the drawer.
  useEffect(() => {
    if (count === 0) setOpen(false);
  }, [count]);

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (count === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="print-hidden fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-on-brand shadow-card transition-transform hover:-translate-y-0.5"
      >
        Your picks
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-on-brand/20 px-1.5 text-xs">
          {count}
        </span>
      </button>

      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === ref.current) setOpen(false);
        }}
        aria-labelledby="picks-title"
        className="print-hidden m-auto w-[min(92vw,26rem)] overflow-hidden rounded-3xl bg-paper p-0 text-ink shadow-card backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
      >
        <div className="animate-pop p-6">
          <div className="flex items-center justify-between">
            <h2 id="picks-title" className="font-display text-xl font-semibold text-ink">
              Your picks
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:text-brand"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <ul className="mt-4 divide-y divide-line">
            {lines.map((line) => (
              <li key={line.item.id} className="flex items-center gap-3 py-3">
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-tint px-1.5 text-xs font-semibold text-brand">
                  {line.qty}
                </span>
                <span className="flex-1 text-sm text-ink">{line.item.name}</span>
                <span className="text-sm tabular-nums text-ink-soft">
                  {formatPrice(line.item.price * line.qty)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(line.item.id)}
                  aria-label={`Remove ${line.item.name}`}
                  className="text-ink-soft transition-colors hover:text-brand"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="text-sm font-medium text-ink-soft">Total</span>
            <span className="font-display text-lg font-semibold tabular-nums text-ink">
              {formatPrice(total)}
            </span>
          </div>

          <p className="mt-4 rounded-xl bg-brand-tint px-3 py-2 text-center text-xs text-ink-soft">
            This is a local list to show our team at the counter. Nothing is
            ordered online.
          </p>

          <button
            type="button"
            onClick={clear}
            className="mt-3 w-full rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-brand"
          >
            Clear list
          </button>
        </div>
      </dialog>
    </>
  );
}
