"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Settings } from "lucide-react";
import type { CardWithRelations, Column } from "@/types/database";
import CardMini from "./CardMini";

export default function ColumnView({
  column,
  cards,
  onOpenCard,
  onCreateCard,
  onOpenSettings,
}: {
  column: Column;
  cards: CardWithRelations[];
  onOpenCard: (cardId: string) => void;
  onCreateCard: (columnId: string, title: string) => void;
  onOpenSettings: (columnId: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const { setNodeRef, isOver } = useDroppable({ id: column.id, data: { type: "column" } });

  const overLimit = column.wip_limit != null && cards.length > column.wip_limit;

  function submitCard() {
    const trimmed = title.trim();
    if (trimmed) onCreateCard(column.id, trimmed);
    setTitle("");
    setAdding(false);
  }

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-xl bg-slate-100">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-700">{column.name}</h3>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[11px] font-medium ${
              overLimit ? "bg-red-100 text-red-700" : "bg-slate-200 text-slate-600"
            }`}
          >
            {cards.length}
            {column.wip_limit != null ? `/${column.wip_limit}` : ""}
          </span>
        </div>
        <button
          onClick={() => onOpenSettings(column.id)}
          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          aria-label="Configurações da coluna"
        >
          <Settings size={14} />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-[60px] flex-1 flex-col gap-2 rounded-lg p-2 transition ${
          isOver ? "bg-indigo-50 ring-2 ring-indigo-200" : ""
        }`}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <CardMini key={card.id} card={card} onOpen={() => onOpenCard(card.id)} />
          ))}
        </SortableContext>

        {!column.block_manual_add &&
          (adding ? (
            <div className="rounded-lg border border-indigo-300 bg-white p-2">
              <textarea
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submitCard();
                  }
                  if (e.key === "Escape") setAdding(false);
                }}
                placeholder="Título do card"
                className="w-full resize-none text-sm outline-none"
                rows={2}
              />
              <div className="mt-1 flex gap-2">
                <button
                  onClick={submitCard}
                  className="rounded bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => setAdding(false)}
                  className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-left text-sm text-slate-500 hover:bg-slate-200"
            >
              <Plus size={14} /> Novo card
            </button>
          ))}
      </div>
    </div>
  );
}
