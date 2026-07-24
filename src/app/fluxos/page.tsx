import Link from "next/link";
import { CalendarDays, CalendarRange, ListChecks, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createClient } from "@/lib/supabase/server";
import { createBoard } from "./actions";
import type { Profile, Tag } from "@/types/database";
import Avatar from "@/components/ui/Avatar";
import TagPill from "@/components/ui/TagPill";
import NewBoardButton from "@/components/fluxos/NewBoardButton";
import PendingTasksList, { type PendingTask } from "@/components/fluxos/PendingTasksList";
import CalendarView, { type CalendarCard } from "@/components/fluxos/CalendarView";
import DailyQuote from "@/components/fluxos/DailyQuote";

export default async function FluxosPage() {
  const supabase = await createClient();

  const [{ data: boards }, { data: recentCardsRaw }, { data: pendingTasksRaw }, { data: calendarCards }] =
    await Promise.all([
      supabase.from("boards").select("id, name, description, created_at").order("created_at", { ascending: false }),
      supabase
        .from("cards")
        .select("id, title, due_date, board_id, leader_id, updated_at, boards(name)")
        .neq("status", "cancelado")
        .order("updated_at", { ascending: false })
        .limit(8),
      supabase
        .from("tasks")
        .select("id, title, card_id, cards(id, title, board_id)")
        .eq("done", false)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("cards")
        .select("id, title, board_id, due_date, status")
        .not("due_date", "is", null)
        .neq("status", "cancelado"),
    ]);

  const recentCards = recentCardsRaw ?? [];
  const leaderIds = [...new Set(recentCards.map((c) => c.leader_id).filter((id): id is string => Boolean(id)))];
  const cardIds = recentCards.map((c) => c.id);

  const [{ data: leaders }, { data: cardTagsRaw }] = await Promise.all([
    leaderIds.length ? supabase.from("profiles").select("*").in("id", leaderIds) : Promise.resolve({ data: [] as Profile[] }),
    cardIds.length ? supabase.from("card_tags").select("*").in("card_id", cardIds) : Promise.resolve({ data: [] as { card_id: string; tag_id: string }[] }),
  ]);

  const cardTags = cardTagsRaw ?? [];
  const tagIds = [...new Set(cardTags.map((ct) => ct.tag_id))];
  const { data: tagsData } = tagIds.length
    ? await supabase.from("tags").select("*").in("id", tagIds)
    : { data: [] as Tag[] };

  const leaderById = new Map((leaders ?? []).map((p) => [p.id, p]));
  const tagById = new Map((tagsData ?? []).map((t) => [t.id, t]));

  const pendingTasks: PendingTask[] = (pendingTasksRaw ?? []).map((t) => {
    const rel = t.cards as { id: string; title: string; board_id: string } | { id: string; title: string; board_id: string }[] | null;
    const card = Array.isArray(rel) ? rel[0] : rel;
    return {
      id: t.id,
      title: t.title,
      cardId: card?.id ?? "",
      cardTitle: card?.title ?? "",
      boardId: card?.board_id ?? "",
    };
  });

  return (
    <div className="flex-1">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="text-2xl font-semibold text-white">Fluxos</h1>
          <p className="mt-1 text-sm text-mova-200">Sua central de rotina e produção.</p>

          <section className="mt-6 flex flex-wrap items-center gap-2.5">
            {boards?.map((board) => (
              <Link
                key={board.id}
                href={`/fluxos/${board.id}`}
                className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-mova-600 via-mova-500 to-mova-600 py-1.5 pl-1.5 pr-5 shadow-lg shadow-black/40 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-mova-700 shadow-inner">
                  {board.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="text-sm font-bold uppercase tracking-wide text-white">
                  {board.name}
                </span>
              </Link>
            ))}
            <NewBoardButton createBoard={createBoard} />
          </section>

          {boards?.length === 0 && (
            <p className="mt-2 text-sm text-mova-200">Nenhum fluxo criado ainda — clique em &quot;Novo fluxo&quot;.</p>
          )}

          {recentCards.length > 0 && (
            <section className="mt-10">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles size={15} className="text-mova-300" />
                <h2 className="text-xs font-semibold uppercase tracking-wide text-mova-200">
                  Cards recentes
                </h2>
              </div>
              <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2">
                {recentCards.map((card) => {
                  const leader = card.leader_id ? leaderById.get(card.leader_id) : null;
                  const tags = cardTags
                    .filter((ct) => ct.card_id === card.id)
                    .map((ct) => tagById.get(ct.tag_id))
                    .filter((t): t is Tag => Boolean(t));
                  const dueDate = card.due_date ? new Date(`${card.due_date}T00:00:00`) : null;
                  const boardsRelation = card.boards as { name: string } | { name: string }[] | null;
                  const boardName = Array.isArray(boardsRelation)
                    ? boardsRelation[0]?.name
                    : boardsRelation?.name;

                  return (
                    <Link
                      key={card.id}
                      href={`/fluxos/${card.board_id}`}
                      className="flex w-56 shrink-0 flex-col rounded-xl border border-mova-100 bg-white p-4 shadow-lg shadow-black/25 transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      <div className="flex items-center gap-1.5">
                        {leader && <Avatar profile={leader} size={20} />}
                        {boardName && (
                          <span className="truncate text-[11px] font-medium text-slate-400">
                            {boardName}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-800">
                        {card.title}
                      </p>
                      {dueDate && (
                        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                          <CalendarDays size={12} />
                          {format(dueDate, "EEE, dd MMM", { locale: ptBR })}
                        </span>
                      )}
                      {tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {tags.slice(0, 2).map((tag) => (
                            <TagPill key={tag.id} tag={tag} />
                          ))}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section className="mt-10">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListChecks size={15} className="text-mova-300" />
                <h2 className="text-xs font-semibold uppercase tracking-wide text-mova-200">
                  Tarefas pendentes
                </h2>
              </div>
              <Link
                href="/fluxos/calendario"
                className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-mova-100 transition hover:bg-white/10"
              >
                <CalendarRange size={13} /> Tarefas
              </Link>
            </div>
            <PendingTasksList initialTasks={pendingTasks} />
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <CalendarView cards={(calendarCards ?? []) as CalendarCard[]} variant="compact" />
          <DailyQuote />
        </aside>
      </div>
    </div>
  );
}
