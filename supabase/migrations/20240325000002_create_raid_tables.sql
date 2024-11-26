-- Create raids table
create table if not exists public.raids (
    id uuid default gen_random_uuid() primary key,
    boss_name text not null,
    boss_description text not null,
    boss_image_url text,
    boss_twitter text,
    boss_health integer not null,
    boss_max_health integer not null,
    boss_defense integer not null default 0,
    boss_xp_reward integer not null,
    state text not null default 'active',
    start_time timestamp with time zone not null default now(),
    end_time timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create raid_quests table
create table if not exists public.raid_quests (
    id uuid default gen_random_uuid() primary key,
    raid_id uuid not null references public.raids(id) on delete cascade,
    description text not null,
    xp_reward integer not null default 0,
    completed_by text[] default array[]::text[],
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create raid_participants table
create table if not exists public.raid_participants (
    id uuid default gen_random_uuid() primary key,
    raid_id uuid not null references public.raids(id) on delete cascade,
    player_id text not null,
    join_time timestamp with time zone not null default now(),
    contribution integer not null default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create indexes
create index if not exists raids_state_idx on public.raids(state);
create index if not exists raid_quests_raid_id_idx on public.raid_quests(raid_id);
create index if not exists raid_participants_raid_id_idx on public.raid_participants(raid_id);
create index if not exists raid_participants_player_id_idx on public.raid_participants(player_id);

-- Set up Row Level Security (RLS)
alter table public.raids enable row level security;
alter table public.raid_quests enable row level security;
alter table public.raid_participants enable row level security;

-- Policies for raids table
create policy "Enable read access for all users"
    on public.raids for select
    using (true);

create policy "Enable insert for admins"
    on public.raids for insert
    with check (admin_only());

create policy "Enable update for admins"
    on public.raids for update
    using (admin_only())
    with check (admin_only());

-- Policies for raid_quests table
create policy "Enable read access for all users"
    on public.raid_quests for select
    using (true);

create policy "Enable insert for admins"
    on public.raid_quests for insert
    with check (admin_only());

create policy "Enable update for admins"
    on public.raid_quests for update
    using (admin_only())
    with check (admin_only());

-- Policies for raid_participants table
create policy "Enable read access for all users"
    on public.raid_participants for select
    using (true);

create policy "Enable insert for authenticated users"
    on public.raid_participants for insert
    with check (auth.role() = 'authenticated');

create policy "Enable update for admins"
    on public.raid_participants for update
    using (admin_only())
    with check (admin_only());

-- Triggers to update timestamps
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
