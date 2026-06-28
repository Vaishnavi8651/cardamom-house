"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useOrder } from "./OrderProvider";
import { formatPrice } from "@/lib/formatPrice";
import { BLUR_DATA_URL } from "@/data/images";
import { TagList } from "../Tag";

/**
 * Item detail modal, built on the native <dialog> element so focus-trapping,
 * Esc-to-close, the backdrop and aria-modal semantics come from the platform.
 * We add backdrop-click-to-close and body scroll-lock. Rendered once at the root;
 * the open item comes from OrderProvider.
 */
export function ItemModal() {
  const { selected, closeItem, add } = useOrder();
  const ref = useRef<HTMLDialogElement>(null);

  // Sync the dialog's open state with context.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  // Lock background scroll while open.
  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);

  const isVeg = selected?.item.tags.includes("V") ?? false;

  return (
    <dialog
      ref={ref}
      onClose={closeItem}
      onClick={(event) => {
        if (event.target === ref.current) closeItem();
      }}
      aria-labelledby="item-modal-title"
      className="print-hidden m-auto w-[min(92vw,30rem)] overflow-hidden rounded-3xl bg-paper p-0 text-ink shadow-card backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      {selected ? (
        <div className="animate-rise">
          {/* Header image (item photo, else category banner, else brand wash). */}
          <div className="relative aspect-[16/9] bg-brand-tint">
            {selected.image ? (
              <Image
                src={selected.image}
                alt={selected.item.name}
                fill
                sizes="(min-width: 640px) 30rem, 92vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            ) : (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-brand-tint-strong to-brand-tint"
              />
            )}
            <button
              type="button"
              onClick={closeItem}
              aria-label="Close"
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink shadow-card transition-colors hover:text-brand"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2">
              {isVeg ? (
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm border-2 border-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span className="sr-only">Vegetarian</span>
                </span>
              ) : null}
              {selected.category ? (
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  {selected.category}
                </span>
              ) : null}
            </div>

            <h2
              id="item-modal-title"
              className="mt-2 font-display text-2xl font-semibold text-ink"
            >
              {selected.item.name}
            </h2>

            {selected.item.description ? (
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {selected.item.description}
              </p>
            ) : null}

            <div className="mt-3">
              <TagList tags={selected.item.tags} />
            </div>

            <p className="mt-4 font-display text-xl font-semibold tabular-nums text-ink">
              {formatPrice(selected.item.price)}
            </p>

            <button
              type="button"
              onClick={() => {
                add(selected.item);
                closeItem();
              }}
              className="mt-5 w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-on-brand transition-transform hover:-translate-y-0.5"
            >
              Add to my picks
            </button>
            <p className="mt-2 text-center text-xs text-ink-soft/70">
              A local list to show our team — nothing is ordered online.
            </p>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
