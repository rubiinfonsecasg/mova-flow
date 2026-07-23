"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const DEFAULT_COLUMNS = [
  { name: "Planejar / Pesquisar", position: 0 },
  { name: "Produção", position: 1 },
  { name: "Aprovação", position: 2 },
  { name: "Concluído", position: 3, is_done_column: true },
];

export async function createBoard(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: board, error } = await supabase
    .from("boards")
    .insert({ name, created_by: user!.id })
    .select()
    .single();

  if (error || !board) {
    throw new Error(error?.message ?? "Não foi possível criar o fluxo.");
  }

  const columns = DEFAULT_COLUMNS.map((c) => ({ ...c, board_id: board.id }));
  await supabase.from("columns").insert(columns);

  revalidatePath("/fluxos");
  redirect(`/fluxos/${board.id}`);
}
