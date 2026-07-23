"use client";

import { useState } from "react";
import { Tag as TagIcon, X } from "lucide-react";

export const TAG_PALETTE = [
  "#9ca3af",
  "#6b7280",
  "#4b5563",
  "#1f2937",
  "#78350f",
  "#c2410c",
  "#dc2626",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#16a34a",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#2563eb",
  "#6366f1",
  "#7c3aed",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f472b6",
];

export default function TagCreateModal({
  initialName = "",
  onClose,
  onCreate,
}: {
  initialName?: string;
  onClose: () => void;
  onCreate: (name: string, color: string) => void;
}) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(TAG_PALETTE[20]);

  function save() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed, color);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Adicionar nova tag</h2>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold uppercase text-slate-400">Nome da tag</label>
          <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 focus-within:border-mova-500 focus-within:ring-2 focus-within:ring-mova-500/30">
            <TagIcon size={15} className="shrink-0 text-slate-400" />
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && save()}
              placeholder="Nome da tag"
              className="w-full text-sm text-slate-900 outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold uppercase text-slate-400">Cor</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {TAG_PALETTE.map((swatch) => (
              <button
                key={swatch}
                type="button"
                aria-label={`Cor ${swatch}`}
                onClick={() => setColor(swatch)}
                style={{ backgroundColor: swatch }}
                className={`h-7 w-7 rounded-full transition ${
                  color === swatch
                    ? "ring-2 ring-mova-600 ring-offset-2"
                    : "hover:scale-110"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={!name.trim()}
            className="rounded-lg bg-mova-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-mova-700 disabled:opacity-50"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
