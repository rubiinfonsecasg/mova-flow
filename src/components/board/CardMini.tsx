"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, isPast, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CardWithRelations } from "@/types/database";
import Avatar from "@/components/ui/Avatar";
import TagPill from "@/components/ui/TagPill";

export function CardVisual({ card }: { card: CardWithRelations }) {
  const dueDate = card.due_date ? new Date(`${card.due_date}T00:00:00`) : null;
  const overdue = dueDate ? isPast(dueDate) && !isToday(dueDate) : false;

  return (
    <>
      <p className="text-sm font-medium text-slate-800">{card.title}</p>

      {card.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {card.tags.map((tag) => (
            <TagPill key={tag.id} tag={tag} />
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="flex -space-x-1">
          {card.leader && <Avatar profile={card.leader} size={22} />}
          {card.assignees.map((a) => (
            <Avatar key={a.id} profile={a} size={22} />
          ))}
        </div>

        {dueDate && (
          <span className={`text-[11px] font-medium ${overdue ? "text-red-600" : "text-slate-500"}`}>
            {format(dueDate, "dd MMM", { locale: ptBR })}
          </span>
        )}
      </div>

      {card.tasks.length > 0 && (
        <p className="mt-1 text-[11px] text-slate-400">
          {card.tasks.filter((t) => t.done).length}/{card.tasks.length} tarefas
        </p>
      )}
    </>
  );
}

export default function CardMini({
  card,
  onOpen,
}: {
  card: CardWithRelations;
  onOpen: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { type: "card", card },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onOpen}
      className="cursor-pointer rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-indigo-300 hover:shadow"
    >
      <CardVisual card={card} />
    </div>
  );
}
