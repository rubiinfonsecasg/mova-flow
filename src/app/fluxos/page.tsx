import { createClient } from "@/lib/supabase/server";
import { createBoard } from "./actions";
import Link from "next/link";

export default async function FluxosPage() {
  const supabase = await createClient();
  const { data: boards } = await supabase
    .from("boards")
    .select("id, name, description, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Fluxos</h1>
      </div>

      <form
        action={createBoard}
        className="mt-6 flex gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-4"
      >
        <input
          name="name"
          type="text"
          required
          placeholder="Nome do novo fluxo (ex: Rotina e Produção)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Criar fluxo
        </button>
      </form>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {boards?.map((board) => (
          <Link
            key={board.id}
            href={`/fluxos/${board.id}`}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow"
          >
            <h2 className="font-medium text-slate-900">{board.name}</h2>
            {board.description && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{board.description}</p>
            )}
          </Link>
        ))}

        {boards?.length === 0 && (
          <p className="col-span-full text-sm text-slate-500">
            Nenhum fluxo criado ainda. Crie o primeiro acima.
          </p>
        )}
      </div>
    </div>
  );
}
