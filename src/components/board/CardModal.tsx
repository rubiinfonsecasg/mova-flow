"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { CardWithRelations, Profile, Tag } from "@/types/database";
import Avatar from "@/components/ui/Avatar";
import TagPicker from "./TagPicker";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function CardModal({
  card,
  profiles,
  boardTags,
  onClose,
  onUpdate,
  onTagsChange,
  onDeleteTag,
  onDeleteCard,
}: {
  card: CardWithRelations;
  profiles: Profile[];
  boardTags: Tag[];
  onClose: () => void;
  onUpdate: (cardId: string, patch: Partial<CardWithRelations>) => void;
  onTagsChange: (boardTag: Tag) => void;
  onDeleteTag: (tagId: string) => void;
  onDeleteCard: (cardId: string) => void;
}) {
  const supabase = createClient();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");
  const [newTask, setNewTask] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function saveTitle() {
    if (title.trim() === card.title) return;
    await supabase.from("cards").update({ title: title.trim() }).eq("id", card.id);
    onUpdate(card.id, { title: title.trim() });
  }

  async function saveDescription() {
    if (description === (card.description ?? "")) return;
    await supabase.from("cards").update({ description }).eq("id", card.id);
    onUpdate(card.id, { description });
  }

  async function setLeader(leaderId: string) {
    const leader = profiles.find((p) => p.id === leaderId) ?? null;
    await supabase
      .from("cards")
      .update({ leader_id: leader?.id ?? null })
      .eq("id", card.id);
    onUpdate(card.id, { leader_id: leader?.id ?? null, leader });
  }

  async function setDueDate(date: string) {
    await supabase
      .from("cards")
      .update({ due_date: date || null })
      .eq("id", card.id);
    onUpdate(card.id, { due_date: date || null });
  }

  async function toggleAssignee(profile: Profile) {
    const isAssigned = card.assignees.some((a) => a.id === profile.id);
    if (isAssigned) {
      await supabase
        .from("card_assignees")
        .delete()
        .eq("card_id", card.id)
        .eq("user_id", profile.id);
      onUpdate(card.id, { assignees: card.assignees.filter((a) => a.id !== profile.id) });
    } else {
      await supabase.from("card_assignees").insert({ card_id: card.id, user_id: profile.id });
      onUpdate(card.id, { assignees: [...card.assignees, profile] });
    }
  }

  async function toggleTag(tag: Tag) {
    const hasTag = card.tags.some((t) => t.id === tag.id);
    if (hasTag) {
      await supabase.from("card_tags").delete().eq("card_id", card.id).eq("tag_id", tag.id);
      onUpdate(card.id, { tags: card.tags.filter((t) => t.id !== tag.id) });
    } else {
      await supabase.from("card_tags").insert({ card_id: card.id, tag_id: tag.id });
      onUpdate(card.id, { tags: [...card.tags, tag] });
    }
  }

  async function createTag(name: string, color: string) {
    const { data: tag } = await supabase
      .from("tags")
      .insert({ board_id: card.board_id, name, color })
      .select()
      .single();
    if (tag) {
      onTagsChange(tag);
      await supabase.from("card_tags").insert({ card_id: card.id, tag_id: tag.id });
      onUpdate(card.id, { tags: [...card.tags, tag] });
    }
  }

  async function addTask() {
    const taskTitle = newTask.trim();
    if (!taskTitle) return;
    const { data: task } = await supabase
      .from("tasks")
      .insert({ card_id: card.id, title: taskTitle, position: card.tasks.length })
      .select()
      .single();
    if (task) onUpdate(card.id, { tasks: [...card.tasks, task] });
    setNewTask("");
  }

  async function toggleTask(taskId: string, done: boolean) {
    await supabase.from("tasks").update({ done }).eq("id", taskId);
    onUpdate(card.id, {
      tasks: card.tasks.map((t) => (t.id === taskId ? { ...t, done } : t)),
    });
  }

  async function deleteTask(taskId: string) {
    await supabase.from("tasks").delete().eq("id", taskId);
    onUpdate(card.id, { tasks: card.tasks.filter((t) => t.id !== taskId) });
  }

  async function setStatus(status: CardWithRelations["status"]) {
    await supabase.from("cards").update({ status }).eq("id", card.id);
    onUpdate(card.id, { status });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <select
            value={card.status}
            onChange={(e) => setStatus(e.target.value as CardWithRelations["status"])}
            className="rounded border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600"
          >
            <option value="ativo">Ativo</option>
            <option value="concluido">Concluído</option>
            <option value="aguardando">Aguardando</option>
            <option value="cancelado">Cancelado</option>
          </select>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded p-1.5 text-red-500 hover:bg-red-50"
              aria-label="Excluir card"
            >
              <Trash2 size={16} />
            </button>
            <button onClick={onClose} className="rounded p-1 hover:bg-slate-100" aria-label="Fechar">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6 px-5 py-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            className="w-full text-lg font-semibold text-slate-900 outline-none focus:border-b focus:border-mova-500"
          />

          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">Líder</label>
            <select
              value={card.leader_id ?? ""}
              onChange={(e) => setLeader(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
            >
              <option value="">Sem líder</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">Equipe</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {profiles.map((p) => {
                const active = card.assignees.some((a) => a.id === p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleAssignee(p)}
                    className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${
                      active
                        ? "border-mova-500 bg-mova-100 text-mova-700"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Avatar profile={p} size={16} />
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">
              Data prevista
            </label>
            <input
              type="date"
              defaultValue={card.due_date ?? ""}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">Tags</label>
            <div className="mt-1">
              <TagPicker
                boardTags={boardTags}
                selectedTags={card.tags}
                onToggle={toggleTag}
                onCreate={createTag}
                onDelete={onDeleteTag}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={saveDescription}
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-mova-500"
              placeholder="Detalhes da pauta, briefing, links..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-slate-400">Tarefas</label>
            <ul className="mt-1 space-y-1">
              {card.tasks.map((task) => (
                <li key={task.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-mova-600"
                    checked={task.done}
                    onChange={(e) => toggleTask(task.id, e.target.checked)}
                  />
                  <span className={task.done ? "flex-1 text-slate-400 line-through" : "flex-1"}>
                    {task.title}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-300 hover:text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex gap-1.5">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="Nova tarefa"
                className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs text-slate-900"
              />
              <button
                onClick={addTask}
                className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-slate-200"
              >
                <Plus size={12} /> Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Excluir card"
          message="Tem certeza que quer apagar?"
          confirmLabel="Sim"
          cancelLabel="Cancelar"
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            onDeleteCard(card.id);
            setShowDeleteConfirm(false);
          }}
        />
      )}
    </div>
  );
}
