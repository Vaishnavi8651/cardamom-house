import type { DietTag } from "@/types/menu";
import { Badge, type BadgeTone } from "./ui/Badge";

/**
 * Domain meaning for each tag: the short visual code, the full word for screen
 * readers, and which Badge tone carries it. Diet tags stay quiet (neutral);
 * only `spicy` takes the amber accent — the brief asks for "distinct but subtle".
 */
const TAG_META: Record<DietTag, { short: string; label: string; tone: BadgeTone }> = {
  V: { short: "V", label: "Vegetarian", tone: "neutral" },
  GF: { short: "GF", label: "Gluten-free", tone: "neutral" },
  spicy: { short: "Spicy", label: "Spicy", tone: "brand" },
};

export function Tag({ tag }: { tag: DietTag }) {
  const meta = TAG_META[tag];
  return (
    <Badge tone={meta.tone}>
      {/* Visible short code; full word read aloud so "V" isn't announced as "vee". */}
      <span aria-hidden="true">{meta.short}</span>
      <span className="sr-only">{meta.label}</span>
    </Badge>
  );
}

export function TagList({ tags }: { tags: DietTag[] }) {
  if (tags.length === 0) return null;
  return (
    <ul
      className="flex flex-wrap items-center gap-1.5"
      aria-label="Dietary information"
    >
      {tags.map((tag) => (
        <li key={tag}>
          <Tag tag={tag} />
        </li>
      ))}
    </ul>
  );
}
