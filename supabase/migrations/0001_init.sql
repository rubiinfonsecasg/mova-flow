-- MOVA FLOW — schema inicial
-- Rode este arquivo no SQL Editor do seu projeto Supabase (ou via `supabase db push`).

-- ─────────────────────────────────────────────────────────────
-- PROFILES (um perfil por usuário autenticado da agência)
-- ─────────────────────────────────────────────────────────────
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  color text not null default '#6366f1',
  created_at timestamptz not null default now()
);

-- cria automaticamente um profile quando um usuário se cadastra
create function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- BOARDS (Fluxos)
-- ─────────────────────────────────────────────────────────────
create table boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- COLUMNS (Colunas do fluxo)
-- ─────────────────────────────────────────────────────────────
create table columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references boards(id) on delete cascade,
  name text not null,
  position int not null default 0,
  description text,
  is_done_column boolean not null default false, -- ex: coluna "Concluído" (só contabiliza)
  block_manual_add boolean not null default false,
  wip_limit int,               -- limite de cards simultâneos nesta coluna
  target_days int,             -- tempo previsto de permanência (dias)
  delivery_qty int,            -- estimativa de entrega: X cards
  delivery_days int,           -- a cada X dias
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- TAGS (por board)
-- ─────────────────────────────────────────────────────────────
create table tags (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references boards(id) on delete cascade,
  name text not null,
  color text not null default '#94a3b8'
);

-- ─────────────────────────────────────────────────────────────
-- CARDS
-- ─────────────────────────────────────────────────────────────
create table cards (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references boards(id) on delete cascade,
  column_id uuid not null references columns(id) on delete cascade,
  parent_card_id uuid references cards(id) on delete set null, -- hierarquia (card pai/filho)
  title text not null,
  description text,
  leader_id uuid references profiles(id),
  due_date date,
  cover_image_url text,
  position numeric not null default 0,
  status text not null default 'ativo' check (status in ('ativo', 'concluido', 'aguardando', 'cancelado')),
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger cards_set_updated_at
  before update on cards
  for each row execute procedure set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- CARD_TAGS / CARD_ASSIGNEES (equipe) / TASKS (checklist)
-- ─────────────────────────────────────────────────────────────
create table card_tags (
  card_id uuid not null references cards(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (card_id, tag_id)
);

create table card_assignees (
  card_id uuid not null references cards(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  primary key (card_id, user_id)
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- TIMELINE (log/auditoria simples por card)
-- ─────────────────────────────────────────────────────────────
create table card_events (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  actor_id uuid references profiles(id),
  event_type text not null,     -- ex: 'created', 'moved', 'tag_added', 'date_changed'
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- Modelo simples: qualquer usuário autenticado (membro da agência)
-- pode ler e escrever em tudo. Se no futuro precisar restringir
-- por fluxo/equipe, trocar estas policies por uma tabela
-- board_members + checagem de membership.
-- ─────────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table boards enable row level security;
alter table columns enable row level security;
alter table tags enable row level security;
alter table cards enable row level security;
alter table card_tags enable row level security;
alter table card_assignees enable row level security;
alter table tasks enable row level security;
alter table card_events enable row level security;

create policy "profiles: leitura autenticada" on profiles for select using (auth.role() = 'authenticated');
create policy "profiles: usuário edita o próprio" on profiles for update using (auth.uid() = id);

create policy "boards: crud autenticado" on boards for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "columns: crud autenticado" on columns for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "tags: crud autenticado" on tags for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "cards: crud autenticado" on cards for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "card_tags: crud autenticado" on card_tags for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "card_assignees: crud autenticado" on card_assignees for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "tasks: crud autenticado" on tasks for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "card_events: crud autenticado" on card_events for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────
-- REALTIME (para o quadro sincronizar entre usuários)
-- ─────────────────────────────────────────────────────────────
alter publication supabase_realtime add table columns;
alter publication supabase_realtime add table cards;
alter publication supabase_realtime add table card_tags;
alter publication supabase_realtime add table card_assignees;
alter publication supabase_realtime add table tasks;
