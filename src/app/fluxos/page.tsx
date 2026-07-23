import Link from "next/link";
import { CalendarDays, Plus, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createClient } from "@/lib/supabase/server";
import { createBoard } from "./actions";
import type { Profile, Tag } from "@/types/database";
import Avatar from "@/components/ui/Avatar";
import TagPill from "@/components/ui/TagPill";
import BrandHero from "@/components/fluxos/BrandHero";

export default async function FluxosPage() {
  const supabase = await createClient();

  const [{ data: boards }, { data: recentCardsRaw }] = await Promise.all([
    supabase.from("boards").select("id, name, description, created_at").order("created_at", { ascending: false }),
    supabase
      .from("cards")
      .select("id, title, due_date, board_id, leader_id, updated_at, boards(name)")
      .neq("status", "cancelado")
      .order("updated_at", { ascending: false })
      .limit(8),
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

  return (
    <div className="relative flex-1 overflow-hidden">
      <BrandHero />

      <div className="relative z-[1] mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-white">Fluxos</h1>
        <p className="mt-1 text-sm text-mova-200">Sua central de rotina e produção.</p>

        {recentCards.length > 0 && (
          <section className="mt-8">
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
                    className="flex w-56 shrink-0 flex-col rounded-xl border border-slate-100 bg-white p-4 shadow-lg shadow-black/25 transition hover:-translate-y-0.5 hover:shadow-xl"
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
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-mova-200">
            Novo fluxo
          </h2>
          <form
            action={createBoard}
            className="flex gap-3 rounded-2xl border border-white/10 bg-mova-900/60 p-3 shadow-xl shadow-black/30 backdrop-blur-sm"
          >
            <input
              name="name"
              type="text"
              required
              placeholder="Nome do novo fluxo (ex: Rotina e Produção)"
              className="flex-1 rounded-xl border border-transparent bg-white px-4 py-3 text-sm text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-mova-500 focus:outline-none focus:ring-2 focus:ring-mova-500/30"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-b from-mova-500 to-mova-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_0_0_var(--color-mova-800),0_8px_16px_-4px_rgba(0,0,0,0.5)] transition hover:brightness-110 active:translate-y-1 active:shadow-[0_1px_0_0_var(--color-mova-800),0_2px_4px_-1px_rgba(0,0,0,0.5)]"
            >
              <Plus size={16} /> Criar fluxo
            </button>
          </form>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-mova-200">
            Seus fluxos
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards?.map((board) => (
              <Link
                key={board.id}
                href={`/fluxos/${board.id}`}
                className="group relative overflow-hidden rounded-xl border border-transparent bg-white p-5 shadow-lg shadow-black/25 transition hover:-translate-y-0.5 hover:border-mova-400 hover:shadow-xl"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-mova-pink via-mova-500 to-mova-teal opacity-0 transition group-hover:opacity-100" />
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-mova-500 to-mova-700 text-sm font-bold text-white">
                    {board.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-medium text-slate-900">{board.name}</h3>
                    {board.description && (
                      <p className="truncate text-xs text-slate-500">{board.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}

            {boards?.length === 0 && (
              <p className="col-span-full text-sm text-mova-200">
                Nenhum fluxo criado ainda. Crie o primeiro acima.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
