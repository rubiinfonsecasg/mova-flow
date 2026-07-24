"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface PendingTask {
  id: string;
  title: string;
  cardId: string;
  cardTitle: string;
  boardId: string;
}

export default function PendingTasksList({ initialTasks }: { initialTasks: PendingTask[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const supabase = createClient();

  async function complete(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await supabase.from("tasks").update({ done: true }).eq("id", taskId);
  }

  if (tasks.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-white/15 px-4 py-4 text-sm text-mova-200">
        Nenhuma tarefa pendente — tudo em dia! 🎉
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white pl-1 pr-3 py-1 shadow-lg shadow-black/20"
        >
          <button
            onClick={() => complete(task.id)}
            aria-label="Concluir tarefa"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mova-100 text-mova-600 transition hover:bg-mova-600 hover:text-white"
          >
            <CheckCircle2 size={15} />
          </button>
          <Link
            href={`/fluxos/${task.boardId}`}
            className="min-w-0 flex-1"
            title={task.cardTitle}
          >
            <p className="truncate text-xs font-medium text-slate-800">{task.title}</p>
            <p className="truncate text-[10px] text-slate-400">{task.cardTitle}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}
