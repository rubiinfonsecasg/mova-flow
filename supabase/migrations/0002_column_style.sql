-- MOVA FLOW — personalização de coluna (ícone + cor de destaque)
-- Rode este arquivo no SQL Editor do seu projeto Supabase.

alter table columns add column if not exists icon text not null default 'layout-list';
alter table columns add column if not exists color text not null default '#7c3aed';
