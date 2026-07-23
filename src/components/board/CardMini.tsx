"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, isPast, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GripVertical } from "lucide-react";
import type { CardWithRelations } from "@/types/database";
import Avatar from "@/components/ui/Avatar";
import TagPill from "@/components/ui/TagPill";

export function isCardOverdue(card: CardWithRelations) {
  if (!card.due_date || card.status === "concluido") return false;
  const dueDate = new Date(`${card.due_date}T00:00:00`);
  return isPast(dueDate) && !isToday(dueDate);
}

export function CardVisual({ card }: { card: CardWithRelations }) {
  const dueDate = card.due_date ? new Date(`${card.due_date}T00:00:00`) : null;
  const overdue = isCardOverdue(card);

  return (
    <>
      <p className={`text-sm font-medium ${overdue ? "text-white" : "text-slate-800"}`}>
        {card.title}
      </p>

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
          <span
            className={`text-[11px] font-medium ${overdue ? "text-white" : "text-slate-500"}`}
          >
            {format(dueDate, "dd MMM", { locale: ptBR })}
          </span>
        )}
      </div>

      {card.tasks.length > 0 && (
        <p className={`mt-1 text-[11px] ${overdue ? "text-mova-100" : "text-slate-400"}`}>
          {card.tasks.filter((t) => t.done).length}/{card.tasks.length} tarefas
        </p>
      )}
    </>
  );
}

export default function CardMini({
  card,
  accentColor,
  onOpen,
}: {
  card: CardWithRelations;
  accentColor?: string;
  onOpen: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { type: "card", card },
  });

  const overdue = isCardOverdue(card);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    borderLeftColor: !overdue && accentColor ? accentColor : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onOpen}
      className={`group relative cursor-pointer rounded-lg border border-l-[3px] p-3 pr-6 shadow-sm transition hover:shadow-md ${
        overdue
          ? "border-mova-800 bg-mova-600 hover:border-mova-700"
          : "border-slate-200 bg-white hover:border-mova-400"
      }`}
    >
      <CardVisual card={card} />
      <GripVertical
        size={14}
        className={`absolute right-1.5 top-1.5 opacity-0 transition group-hover:opacity-100 ${
          overdue ? "text-mova-200" : "text-slate-300"
        }`}
      />
    </div>
  );
}
