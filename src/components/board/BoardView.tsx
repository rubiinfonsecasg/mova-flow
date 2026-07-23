"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Board, CardWithRelations, Column, Profile, Tag } from "@/types/database";
import ColumnView from "./ColumnView";
import CardModal from "./CardModal";
import ColumnSettingsModal from "./ColumnSettingsModal";
import { CardVisual } from "./CardMini";

export default function BoardView({
  board,
  initialColumns,
  initialCards,
  boardTags,
  profiles,
}: {
  board: Board;
  initialColumns: Column[];
  initialCards: CardWithRelations[];
  boardTags: Tag[];
  profiles: Profile[];
}) {
  const supabase = useMemo(() => createClient(), []);
  const [columns, setColumns] = useState(initialColumns);
  const [cards, setCards] = useState(initialCards);
  const [tags, setTags] = useState(boardTags);
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [settingsColumnId, setSettingsColumnId] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<CardWithRelations | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  // Realtime: reflete no quadro alterações feitas por outros usuários da equipe
  useEffect(() => {
    const channel = supabase
      .channel(`board-${board.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cards", filter: `board_id=eq.${board.id}` },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const oldId = (payload.old as { id: string }).id;
            setCards((prev) => prev.filter((c) => c.id !== oldId));
            return;
          }
          const row = payload.new as CardWithRelations;
          setCards((prev) => {
            const exists = prev.some((c) => c.id === row.id);
            if (!exists) {
              return [...prev, { ...row, tags: [], assignees: [], tasks: [], leader: null } as CardWithRelations];
            }
            return prev.map((c) => (c.id === row.id ? { ...c, ...row } : c));
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "columns", filter: `board_id=eq.${board.id}` },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const oldId = (payload.old as { id: string }).id;
            setColumns((prev) => prev.filter((c) => c.id !== oldId));
            return;
          }
          const row = payload.new as Column;
          setColumns((prev) => {
            const exists = prev.some((c) => c.id === row.id);
            const next = exists ? prev.map((c) => (c.id === row.id ? row : c)) : [...prev, row];
            return next.sort((a, b) => a.position - b.position);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [board.id, supabase]);

  function cardsForColumn(columnId: string) {
    return cards.filter((c) => c.column_id === columnId).sort((a, b) => a.position - b.position);
  }

  function handleDragStart(event: DragStartEvent) {
    const card = cards.find((c) => c.id === event.active.id);
    setActiveCard(card ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const draggedCard = cards.find((c) => c.id === active.id);
    if (!draggedCard) return;

    const overIsColumn = columns.some((c) => c.id === over.id);
    const targetColumnId = overIsColumn
      ? String(over.id)
      : cards.find((c) => c.id === over.id)?.column_id;
    if (!targetColumnId) return;

    const destCards = cardsForColumn(targetColumnId).filter((c) => c.id !== draggedCard.id);
    let insertIndex = destCards.length;
    if (!overIsColumn) {
      const overIndex = destCards.findIndex((c) => c.id === over.id);
      if (overIndex !== -1) insertIndex = overIndex;
    }
    destCards.splice(insertIndex, 0, { ...draggedCard, column_id: targetColumnId });

    const updatedPositions = destCards.map((c, index) => ({ id: c.id, position: index }));

    setCards((prev) =>
      prev.map((c) => {
        const updated = updatedPositions.find((u) => u.id === c.id);
        return updated ? { ...c, column_id: targetColumnId, position: updated.position } : c;
      })
    );

    await Promise.all(
      updatedPositions.map((u) =>
        supabase.from("cards").update({ column_id: targetColumnId, position: u.position }).eq("id", u.id)
      )
    );
  }

  async function handleCreateCard(columnId: string, title: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const position = cardsForColumn(columnId).length;
    const { data: card, error } = await supabase
      .from("cards")
      .insert({ board_id: board.id, column_id: columnId, title, position, created_by: user?.id })
      .select()
      .single();

    if (!error && card) {
      setCards((prev) => [
        ...prev,
        { ...(card as CardWithRelations), tags: [], assignees: [], tasks: [], leader: null },
      ]);
    }
  }

  function handleUpdateCard(cardId: string, patch: Partial<CardWithRelations>) {
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, ...patch } : c)));
  }

  async function handleCreateColumn() {
    const name = "Nova coluna";
    const position = columns.length;
    const { data: column, error } = await supabase
      .from("columns")
      .insert({ board_id: board.id, name, position })
      .select()
      .single();
    if (!error && column) {
      setColumns((prev) => [...prev, column as Column]);
      setSettingsColumnId((column as Column).id);
    }
  }

  async function handleSaveColumnSettings(columnId: string, patch: Partial<Column>) {
    setColumns((prev) => prev.map((c) => (c.id === columnId ? { ...c, ...patch } : c)));
    await supabase.from("columns").update(patch).eq("id", columnId);
  }

  async function handleDeleteColumn(columnId: string) {
    setColumns((prev) => prev.filter((c) => c.id !== columnId));
    setCards((prev) => prev.filter((c) => c.column_id !== columnId));
    setSettingsColumnId(null);
    await supabase.from("columns").delete().eq("id", columnId);
  }

  const openCard = cards.find((c) => c.id === openCardId) ?? null;
  const settingsColumn = columns.find((c) => c.id === settingsColumnId) ?? null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-slate-200 bg-white px-6 py-3">
        <h1 className="text-lg font-semibold text-slate-900">{board.name}</h1>
      </div>

      <div className="flex flex-1 gap-4 overflow-x-auto p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {columns.map((column) => (
            <ColumnView
              key={column.id}
              column={column}
              cards={cardsForColumn(column.id)}
              onOpenCard={setOpenCardId}
              onCreateCard={handleCreateCard}
              onOpenSettings={setSettingsColumnId}
            />
          ))}

          <DragOverlay>
            {activeCard && (
              <div className="w-72 rounded-lg border border-indigo-300 bg-white p-3 shadow-lg">
                <CardVisual card={activeCard} />
              </div>
            )}
          </DragOverlay>
        </DndContext>

        <button
          onClick={handleCreateColumn}
          className="flex h-10 w-56 shrink-0 items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 text-sm text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600"
        >
          <Plus size={16} /> Nova coluna
        </button>
      </div>

      {openCard && (
        <CardModal
          card={openCard}
          profiles={profiles}
          boardTags={tags}
          onClose={() => setOpenCardId(null)}
          onUpdate={handleUpdateCard}
          onTagsChange={(tag) => setTags((prev) => [...prev, tag])}
        />
      )}

      {settingsColumn && (
        <ColumnSettingsModal
          column={settingsColumn}
          onClose={() => setSettingsColumnId(null)}
          onSave={handleSaveColumnSettings}
          onDelete={handleDeleteColumn}
        />
      )}
    </div>
  );
}
