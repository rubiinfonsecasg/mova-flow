"use client";

import { useMemo, useState } from "react";
import { Plus, Tag as TagIcon, Trash2 } from "lucide-react";
import type { Tag } from "@/types/database";
import TagPill from "@/components/ui/TagPill";
import TagCreateModal from "./TagCreateModal";

export default function TagPicker({
  boardTags,
  selectedTags,
  onToggle,
  onCreate,
  onDelete,
}: {
  boardTags: Tag[];
  selectedTags: Tag[];
  onToggle: (tag: Tag) => void;
  onCreate: (name: string, color: string) => void;
  onDelete: (tagId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const trimmedQuery = query.trim();

  const matches = useMemo(() => {
    const selectedIds = new Set(selectedTags.map((t) => t.id));
    const q = trimmedQuery.toLowerCase();
    return boardTags
      .filter((t) => !selectedIds.has(t.id))
      .filter((t) => (q ? t.name.toLowerCase().includes(q) : true));
  }, [boardTags, selectedTags, trimmedQuery]);

  const hasExactMatch = boardTags.some((t) => t.name.toLowerCase() === trimmedQuery.toLowerCase());

  function selectTag(tag: Tag) {
    onToggle(tag);
    setQuery("");
    setOpen(false);
  }

  function deleteTag(tag: Tag) {
    if (window.confirm(`Excluir a tag "${tag.name}"? Ela será removida de todos os cards.`)) {
      onDelete(tag.id);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (matches.length > 0) {
        selectTag(matches[0]);
      } else if (trimmedQuery && !hasExactMatch) {
        setShowCreateModal(true);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div>
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map((tag) => (
            <TagPill key={tag.id} tag={tag} onRemove={() => onToggle(tag)} />
          ))}
        </div>
      )}

      <div className="relative mt-2">
        <div className="flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-1.5 focus-within:border-mova-500 focus-within:ring-2 focus-within:ring-mova-500/30">
          <TagIcon size={14} className="shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar ou criar tag..."
            className="w-full text-sm text-slate-900 outline-none"
          />
        </div>

        {open && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
            {matches.length > 0 && (
              <ul className="max-h-44 overflow-y-auto py-1">
                {matches.map((tag, index) => (
                  <li key={tag.id} className="group flex items-center gap-1 px-1 hover:bg-slate-50">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectTag(tag)}
                      className="flex flex-1 items-center justify-between gap-2 rounded px-2 py-2"
                    >
                      <TagPill tag={tag} />
                      {index === 0 && (
                        <span className="text-[10px] text-slate-400">
                          Tecle <span className="font-semibold text-mova-600">Enter</span> para
                          selecionar
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => deleteTag(tag)}
                      aria-label={`Excluir tag ${tag.name}`}
                      className="shrink-0 rounded p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {trimmedQuery && !hasExactMatch && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowCreateModal(true);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-sm text-mova-600 hover:bg-mova-50 ${
                  matches.length > 0 ? "border-t border-slate-100" : ""
                }`}
              >
                <Plus size={14} /> Criar tag &quot;{trimmedQuery}&quot;
              </button>
            )}

            {matches.length === 0 && !trimmedQuery && (
              <p className="px-3 py-2 text-xs text-slate-400">Digite para buscar ou criar uma tag.</p>
            )}
          </div>
        )}
      </div>

      {showCreateModal && (
        <TagCreateModal
          initialName={trimmedQuery}
          onClose={() => setShowCreateModal(false)}
          onCreate={(name, color) => {
            onCreate(name, color);
            setQuery("");
          }}
        />
      )}
    </div>
  );
}
