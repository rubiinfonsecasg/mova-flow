"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function NewBoardButton({
  createBoard,
}: {
  createBoard: (formData: FormData) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-dashed border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-mova-100 transition hover:border-mova-400 hover:bg-white/10 hover:text-white"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
          <Plus size={13} />
        </span>
        Novo fluxo
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Novo fluxo</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <form action={createBoard} className="mt-4">
              <label className="text-xs font-semibold uppercase text-slate-400">
                Nome do fluxo
              </label>
              <input
                autoFocus
                name="name"
                type="text"
                required
                placeholder="Ex: Rotina e Produção"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-mova-500 focus:outline-none focus:ring-2 focus:ring-mova-500/30"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-mova-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-mova-700"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
