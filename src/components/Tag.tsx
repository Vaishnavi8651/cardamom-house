import type { DietTag } from "@/lib/types";

/** Human-readable meaning for each tag, used for the accessible label. */
const TAG_META: Record<DietTag, { label: string; short: string }> = {
  V: { label: "Vegetarian", short: "V" },
  GF: { label: "Gluten-free", short: "GF" },
  spicy: { label: "Spicy", short: "Spicy" },
};

export function Tag({ tag }: { tag: DietTag }) {
  const meta = TAG_META[tag];
  const isSpicy = tag === "spicy";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        isSpicy
          ? "border-brand/30 bg-brand-tint text-brand"
          : "border-line bg-paper text-ink-soft",
      ].join(" ")}
      title={meta.label}
    >
      {/* Visible short code, with a full word for screen readers. */}
      <span aria-hidden="true">{meta.short}</span>
      <span className="sr-only">{meta.label}</span>
    </span>
  );
}

export function TagList({ tags }: { tags: DietTag[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap items-center gap-1.5" aria-label="Dietary tags">
      {tags.map((tag) => (
        <li key={tag}>
          <Tag tag={tag} />
        </li>
      ))}
    </ul>
  );
}
