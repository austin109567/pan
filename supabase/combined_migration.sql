-- Begin transaction
begin;

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create admin check function
create or replace function public.admin_only()
returns boolean as $$
begin
  return (
    auth.role() = 'service_role' 
    or 
    auth.uid() in (
      select auth.uid() 
      from auth.users 
      where auth.email() = any(string_to_array(current_setting('app.admin_emails', true), ','))
    )
  );
end;
$$ language plpgsql security definer;

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop existing tables if they exist (in correct order to handle foreign keys)
drop table if exists public.raid_participants cascade;
drop table if exists public.raid_quests cascade;
drop table if exists public.raids cascade;
drop table if exists public.quests cascade;
drop table if exists public.players cascade;

-- Create tables in order (independent tables first, then dependent tables)
-- Create players table
create table public.players (
    id uuid primary key default uuid_generate_v4(),
    wallet_address text unique not null,
    username text,
    xp integer default 0,
    level integer default 1,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create quests table
create table public.quests (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    type text not null check (type in ('daily', 'weekly', 'monthly')),
    xp_reward integer not null default 0,
    is_raid_boss boolean default false,
    completed_by text[] default array[]::text[],
    pending_submissions text[] default array[]::text[],
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create raids table
create table public.raids (
    id uuid primary key default uuid_generate_v4(),
    "baseHp" integer not null,
    "imageUrl" text,
    name text not null,
    description text not null,
    "twitterHandle" text,
    health integer not null,
    "maxHealth" integer not null,
    defense integer not null default 0,
    level integer not null default 1,
    state text not null default 'active' check (state in ('preparing', 'active', 'completed', 'failed')),
    "startTime" bigint not null default extract(epoch from now())::bigint,
    "endTime" bigint,
    "questCompletions" integer not null default 0,
    quests jsonb not null default '[]'::jsonb,
    rewards jsonb not null default '{"xp": 0, "bonusXp": 0}'::jsonb,
    participants jsonb not null default '[]'::jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create index for jsonb columns
create index raids_quests_idx on public.raids using gin (quests);
create index raids_participants_idx on public.raids using gin (participants);
create index raids_rewards_idx on public.raids using gin (rewards);

-- Create raid_quests table
create table public.raid_quests (
    id uuid primary key default uuid_generate_v4(),
    raid_id uuid not null references public.raids(id) on delete cascade,
    description text not null,
    xp_reward integer not null default 0,
    completed_by text[] default array[]::text[],
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create raid_participants table
create table public.raid_participants (
    id uuid primary key default uuid_generate_v4(),
    raid_id uuid not null references public.raids(id) on delete cascade,
    player_id text not null,
    join_time timestamp with time zone not null default now(),
    contribution integer not null default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create indexes
create index raids_state_idx on public.raids(state);
create index raid_quests_raid_id_idx on public.raid_quests(raid_id);
create index raid_participants_raid_id_idx on public.raid_participants(raid_id);
create index raid_participants_player_id_idx on public.raid_participants(player_id);

-- Enable Row Level Security
alter table public.players enable row level security;
alter table public.quests enable row level security;
alter table public.raids enable row level security;
alter table public.raid_quests enable row level security;
alter table public.raid_participants enable row level security;

-- Drop existing policies
do $$ 
declare
    _sql text;
begin
    for _sql in (
        select format('drop policy if exists %I on %I.%I;',
            policyname, schemaname, tablename)
        from pg_policies
        where schemaname = 'public'
        and tablename in ('players', 'quests', 'raids', 'raid_quests', 'raid_participants')
    ) loop
        if _sql is not null then
            execute _sql;
        end if;
    end loop;
end $$;

-- Create policies
-- Players policies
create policy "players_select_policy"
    on public.players for select
    using (true);

create policy "players_update_policy"
    on public.players for update
    using (auth.uid()::text = wallet_address);

create policy "players_insert_policy"
    on public.players for insert
    with check (auth.uid()::text = wallet_address);

-- Quests policies
create policy "quests_select_policy"
    on public.quests for select
    using (true);

create policy "quests_insert_policy"
    on public.quests for insert
    with check (admin_only());

create policy "quests_update_policy"
    on public.quests for update
    using (admin_only());

create policy "quests_delete_policy"
    on public.quests for delete
    using (admin_only());

-- Raids policies
create policy "raids_select_policy"
    on public.raids for select
    using (true);

create policy "raids_insert_policy"
    on public.raids for insert
    with check (admin_only());

create policy "raids_update_policy"
    on public.raids for update
    using (admin_only());

-- Raid quests policies
create policy "raid_quests_select_policy"
    on public.raid_quests for select
    using (true);

create policy "raid_quests_insert_policy"
    on public.raid_quests for insert
    with check (admin_only());

create policy "raid_quests_update_policy"
    on public.raid_quests for update
    using (admin_only());

-- Raid participants policies
create policy "raid_participants_select_policy"
    on public.raid_participants for select
    using (true);

create policy "raid_participants_insert_policy"
    on public.raid_participants for insert
    with check (auth.role() = 'authenticated');

create policy "raid_participants_update_policy"
    on public.raid_participants for update
    using (admin_only());

-- Create triggers
drop trigger if exists set_players_updated_at on public.players;
create trigger set_players_updated_at
    before update on public.players
    for each row
    execute function public.handle_updated_at();

drop trigger if exists set_quests_updated_at on public.quests;
create trigger set_quests_updated_at
    before update on public.quests
    for each row
    execute function public.handle_updated_at();

drop trigger if exists set_raids_updated_at on public.raids;
create trigger set_raids_updated_at
    before update on public.raids
    for each row
    execute function public.handle_updated_at();

drop trigger if exists set_raid_quests_updated_at on public.raid_quests;
create trigger set_raid_quests_updated_at
    before update on public.raid_quests
    for each row
    execute function public.handle_updated_at();

drop trigger if exists set_raid_participants_updated_at on public.raid_participants;
create trigger set_raid_participants_updated_at
    before update on public.raid_participants
    for each row
    execute function public.handle_updated_at();

-- Commit transaction
commit;
