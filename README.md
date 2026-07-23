# Mova Flow

Sistema de gestão de fluxos de produção da agência — um Kanban avançado (fluxos → colunas
configuráveis → cards), inspirado no Ummense. Este é o MVP: quadro Kanban com
drag-and-drop, cards detalhados (líder, equipe, tags, data, checklist) e sincronização em
tempo real entre a equipe.

Stack: **Next.js (App Router) + Supabase (Postgres, Auth, Realtime) + Vercel**.

## 1. Criar o projeto no Supabase

1. Crie uma conta grátis em [supabase.com](https://supabase.com) e clique em "New Project".
2. Escolha um nome (ex: `mova-flow`), uma senha para o banco e a região mais próxima.
3. Quando o projeto terminar de provisionar, vá em **SQL Editor** (menu lateral).
4. Abra o arquivo [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   deste repositório, copie todo o conteúdo, cole no SQL Editor e clique em **Run**.
   Isso cria todas as tabelas (`boards`, `columns`, `cards`, `tags`, `tasks`, etc.), as
   políticas de segurança (RLS) e habilita o Realtime.
5. Vá em **Project Settings → API**. Copie a **Project URL** e a chave **anon public**.

## 2. Configurar o projeto localmente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` e cole os valores copiados do Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

Instale as dependências (se ainda não instalou) e rode o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Você será redirecionado para
`/login` — crie uma conta (isso já cria seu usuário e seu perfil automaticamente) e comece
a usar: criar um fluxo, colunas e cards, arrastar entre colunas e abrir o card para editar
detalhes.

Todos que criarem conta no mesmo projeto Supabase fazem parte da mesma "agência" e podem
ver e editar todos os fluxos (é assim que o modelo de permissões do MVP funciona — sem
separação por equipe ainda).

## 3. Publicar (deploy) na Vercel

1. Suba este projeto para um repositório no GitHub (se ainda não estiver em um).
2. Crie uma conta grátis em [vercel.com](https://vercel.com) e clique em **Add New → Project**,
   selecionando o repositório.
3. Em **Environment Variables**, adicione as mesmas duas variáveis do `.env.local`
   (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Clique em **Deploy**. Depois de pronto, a Vercel te dá uma URL pública — é esse link
   que a equipe vai usar no dia a dia.

## O que já existe no MVP

- Login/cadastro (Supabase Auth).
- Fluxos (boards): criar e listar.
- Quadro Kanban: colunas configuráveis (nome, limite WIP, dias previstos, bloquear
  inclusão manual, marcar como coluna "Concluído"), criar/editar/excluir coluna.
- Cards: criar, arrastar entre colunas (drag-and-drop com sincronização em tempo real
  entre usuários), líder, equipe, tags coloridas (criação inline), data prevista,
  descrição, checklist de tarefas, status (ativo/concluído/aguardando/cancelado).

## O que fica para as próximas fases

Automações por coluna, CRM (Contatos/Empresas), repositório de arquivos (U-Drive),
visões de Tabela/Gantt/Indicadores, timeline/auditoria visual do card (a tabela já existe
no banco: `card_events`), hierarquia de cards pai/filho na interface (coluna já existe no
banco: `parent_card_id`), webhooks, integrações (WhatsApp, e-mail, Trello), filtros
avançados, privacidade pública/secreta por fluxo.

## Estrutura do projeto

```
src/
  app/
    login/            página + server actions de login/cadastro
    fluxos/            lista de fluxos + layout autenticado
    fluxos/[id]/       página do quadro Kanban de um fluxo
  components/
    board/             BoardView, ColumnView, CardMini, CardModal, ColumnSettingsModal
    ui/                Avatar, TagPill
  lib/supabase/        clients (browser/server) e helper de sessão usado pelo proxy.ts
  types/database.ts    tipos TypeScript das tabelas
supabase/migrations/    schema SQL do banco
```
