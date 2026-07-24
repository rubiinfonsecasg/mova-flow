import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import CalendarView from "@/components/fluxos/CalendarView";

export default async function CalendarioPage() {
  const supabase = await createClient();

  const { data: cards } = await supabase
    .from("cards")
    .select("id, title, board_id, due_date, status")
    .not("due_date", "is", null)
    .neq("status", "cancelado");

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <Link
        href="/fluxos"
        className="inline-flex items-center gap-1 text-sm text-mova-200 hover:text-white"
      >
        <ArrowLeft size={14} /> Voltar
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-white">Calendário de tarefas</h1>
      <p className="mt-1 text-sm text-mova-200">
        Todos os cards com data prevista, de todos os seus fluxos. Datas em vermelho estão
        vencidas e ainda não concluídas.
      </p>

      <div className="mt-6">
        <CalendarView cards={cards ?? []} variant="full" />
      </div>
    </div>
  );
}
