import type { Tag } from "@/types/database";

export default function TagPill({ tag, onRemove }: { tag: Tag; onRemove?: () => void }) {
  return (
    <span
      style={{ backgroundColor: `${tag.color}22`, color: tag.color, borderColor: `${tag.color}55` }}
      className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium"
    >
      {tag.name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full hover:opacity-70"
          aria-label={`Remover tag ${tag.name}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
