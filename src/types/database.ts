export type CardStatus = "ativo" | "concluido" | "aguardando" | "cancelado";

export interface Profile {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Board {
  id: string;
  name: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Column {
  id: string;
  board_id: string;
  name: string;
  position: number;
  description: string | null;
  is_done_column: boolean;
  block_manual_add: boolean;
  wip_limit: number | null;
  target_days: number | null;
  delivery_qty: number | null;
  delivery_days: number | null;
  icon: string;
  color: string;
  created_at: string;
}

export interface Tag {
  id: string;
  board_id: string;
  name: string;
  color: string;
}

export interface Card {
  id: string;
  board_id: string;
  column_id: string;
  parent_card_id: string | null;
  title: string;
  description: string | null;
  leader_id: string | null;
  due_date: string | null;
  cover_image_url: string | null;
  position: number;
  status: CardStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  card_id: string;
  title: string;
  done: boolean;
  position: number;
  created_at: string;
}

export interface CardWithRelations extends Card {
  tags: Tag[];
  assignees: Profile[];
  tasks: Task[];
  leader: Profile | null;
}
