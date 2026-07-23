import type { Tag } from "@/types/database";

export default function TagPill({ tag, onRemove }: { tag: Tag; onRemove?: () => void }) {
  return (
    <span
      style={{ backgroundColor: tag.color }}
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white"
    >
      {tag.name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="-mr-0.5 ml-0.5 rounded-full leading-none hover:opacity-70"
          aria-label={`Remover tag ${tag.name}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
