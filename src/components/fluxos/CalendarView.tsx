"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface CalendarCard {
  id: string;
  title: string;
  board_id: string;
  due_date: string;
  status: string;
}

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

function dateKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function CalendarView({
  cards,
  variant = "full",
}: {
  cards: CalendarCard[];
  variant?: "full" | "compact";
}) {
  const [cursor, setCursor] = useState(() => new Date());

  const cardsByDay = useMemo(() => {
    const map = new Map<string, CalendarCard[]>();
    for (const card of cards) {
      const list = map.get(card.due_date) ?? [];
      list.push(card);
      map.set(card.due_date, list);
    }
    return map;
  }, [cards]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startWeekday = firstDay.getDay();
    const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, i) => {
      const dayNumber = i - startWeekday + 1;
      const inMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
      const cellDate = inMonth ? new Date(year, month, dayNumber) : null;
      const key = inMonth ? dateKey(year, month, dayNumber) : null;
      return { dayNumber, inMonth, cellDate, key };
    });
  }, [year, month]);

  function isOverdue(card: CalendarCard) {
    if (card.status === "concluido") return false;
    return isPast(new Date(`${card.due_date}T00:00:00`)) && !isToday(new Date(`${card.due_date}T00:00:00`));
  }

  return (
    <div
      className={`rounded-2xl bg-white shadow-xl shadow-black/30 ${
        variant === "compact" ? "p-4" : "p-4 sm:p-6"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3
          className={`font-semibold capitalize ${
            variant === "compact" ? "text-sm text-slate-800" : "text-lg text-slate-900"
          }`}
        >
          {format(cursor, "MMMM yyyy", { locale: ptBR })}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="rounded p-1 text-slate-400 hover:bg-slate-100"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCursor(new Date())}
            className="rounded px-2 py-0.5 text-xs font-medium text-mova-600 hover:bg-mova-100"
          >
            Hoje
          </button>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="rounded p-1 text-slate-400 hover:bg-slate-100"
            aria-label="Próximo mês"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-slate-400">
        {WEEKDAYS.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          const dayCards = cell.key ? (cardsByDay.get(cell.key) ?? []) : [];
          const hasOverdue = dayCards.some(isOverdue);
          const today = cell.cellDate ? isToday(cell.cellDate) : false;

          return (
            <div
              key={i}
              className={`flex flex-col rounded-lg ${variant === "compact" ? "min-h-[34px] items-center py-1" : "min-h-[76px] p-1"} ${
                !cell.inMonth ? "opacity-30" : ""
              } ${today ? "bg-mova-100 ring-1 ring-mova-400" : ""}`}
            >
              <span
                className={`text-[11px] font-medium ${today ? "text-mova-700" : "text-slate-500"}`}
              >
                {cell.inMonth ? cell.dayNumber : ""}
              </span>

              {variant === "compact" ? (
                dayCards.length > 0 && (
                  <span
                    className={`mt-0.5 h-1.5 w-1.5 rounded-full ${hasOverdue ? "bg-red-500" : "bg-mova-400"}`}
                  />
                )
              ) : (
                <div className="mt-1 flex flex-1 flex-col gap-0.5">
                  {dayCards.slice(0, 2).map((card) => (
                    <Link
                      key={card.id}
                      href={`/fluxos/${card.board_id}`}
                      title={card.title}
                      className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${
                        isOverdue(card)
                          ? "bg-red-100 text-red-700"
                          : "bg-mova-100 text-mova-700"
                      }`}
                    >
                      {card.title}
                    </Link>
                  ))}
                  {dayCards.length > 2 && (
                    <span className="text-[10px] text-slate-400">+{dayCards.length - 2}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
