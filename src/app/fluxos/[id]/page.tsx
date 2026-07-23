import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BoardView from "@/components/board/BoardView";
import type { Card, CardWithRelations, Column, Profile, Tag, Task } from "@/types/database";

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: board } = await supabase.from("boards").select("*").eq("id", id).single();
  if (!board) notFound();

  const [columnsRes, cardsRes, tagsRes, profilesRes] = await Promise.all([
    supabase.from("columns").select("*").eq("board_id", id).order("position"),
    supabase
      .from("cards")
      .select("*")
      .eq("board_id", id)
      .neq("status", "cancelado")
      .order("position"),
    supabase.from("tags").select("*").eq("board_id", id),
    supabase.from("profiles").select("*"),
  ]);

  const columns = (columnsRes.data ?? []) as Column[];
  const cards = (cardsRes.data ?? []) as Card[];
  const tags = (tagsRes.data ?? []) as Tag[];
  const profiles = (profilesRes.data ?? []) as Profile[];
  const cardIds = cards.map((c) => c.id);

  const [cardTagsRes, cardAssigneesRes, tasksRes] = await Promise.all([
    cardIds.length
      ? supabase.from("card_tags").select("*").in("card_id", cardIds)
      : Promise.resolve({ data: [] }),
    cardIds.length
      ? supabase.from("card_assignees").select("*").in("card_id", cardIds)
      : Promise.resolve({ data: [] }),
    cardIds.length
      ? supabase.from("tasks").select("*").in("card_id", cardIds).order("position")
      : Promise.resolve({ data: [] }),
  ]);

  const cardTags = (cardTagsRes.data ?? []) as { card_id: string; tag_id: string }[];
  const cardAssignees = (cardAssigneesRes.data ?? []) as { card_id: string; user_id: string }[];
  const tasks = (tasksRes.data ?? []) as Task[];

  const profileById = new Map(profiles.map((p) => [p.id, p]));
  const tagById = new Map(tags.map((t) => [t.id, t]));

  const cardsWithRelations: CardWithRelations[] = cards.map((card) => ({
    ...card,
    leader: card.leader_id ? (profileById.get(card.leader_id) ?? null) : null,
    tags: cardTags
      .filter((ct) => ct.card_id === card.id)
      .map((ct) => tagById.get(ct.tag_id))
      .filter((t): t is Tag => Boolean(t)),
    assignees: cardAssignees
      .filter((ca) => ca.card_id === card.id)
      .map((ca) => profileById.get(ca.user_id))
      .filter((p): p is Profile => Boolean(p)),
    tasks: tasks.filter((t) => t.card_id === card.id),
  }));

  return (
    <BoardView
      board={board}
      initialColumns={columns}
      initialCards={cardsWithRelations}
      boardTags={tags}
      profiles={profiles}
    />
  );
}
