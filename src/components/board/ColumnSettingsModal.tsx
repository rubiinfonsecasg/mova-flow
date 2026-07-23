"use client";

import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import type { Column } from "@/types/database";

export default function ColumnSettingsModal({
  column,
  onClose,
  onSave,
  onDelete,
}: {
  column: Column;
  onClose: () => void;
  onSave: (columnId: string, patch: Partial<Column>) => void;
  onDelete: (columnId: string) => void;
}) {
  const [name, setName] = useState(column.name);
  const [wipLimit, setWipLimit] = useState(column.wip_limit?.toString() ?? "");
  const [targetDays, setTargetDays] = useState(column.target_days?.toString() ?? "");
  const [blockManualAdd, setBlockManualAdd] = useState(column.block_manual_add);
  const [isDoneColumn, setIsDoneColumn] = useState(column.is_done_column);

  function save() {
    onSave(column.id, {
      name: name.trim() || column.name,
      wip_limit: wipLimit ? Number(wipLimit) : null,
      target_days: targetDays ? Number(targetDays) : null,
      block_manual_add: blockManualAdd,
      is_done_column: isDoneColumn,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Configurações da coluna</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-400">
                Limite WIP
              </label>
              <input
                type="number"
                min={0}
                value={wipLimit}
                onChange={(e) => setWipLimit(e.target.value)}
                placeholder="Sem limite"
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-400">
                Dias previstos
              </label>
              <input
                type="number"
                min={0}
                value={targetDays}
                onChange={(e) => setTargetDays(e.target.value)}
                placeholder="—"
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              className="accent-mova-600"
              checked={blockManualAdd}
              onChange={(e) => setBlockManualAdd(e.target.checked)}
            />
            Bloquear inclusão manual de cards
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              className="accent-mova-600"
              checked={isDoneColumn}
              onChange={(e) => setIsDoneColumn(e.target.checked)}
            />
            É a coluna &quot;Concluído&quot;
          </label>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => onDelete(column.id)}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-red-600 hover:bg-red-50"
          >
            <Trash2 size={13} /> Excluir coluna
          </button>
          <button
            onClick={save}
            className="rounded-lg bg-mova-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-mova-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
