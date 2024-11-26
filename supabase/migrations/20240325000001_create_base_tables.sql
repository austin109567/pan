-- Create players table
create table if not exists public.players (
    id uuid primary key default uuid_generate_v4(),
    wallet_address text unique not null,
    username text,
    xp integer default 0,
    level integer default 1,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create quests table
create table if not exists public.quests (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    type text not null check (type in ('daily', 'weekly', 'monthly')),
    xp_reward integer not null default 0,
    is_raid_boss boolean default false,
    completed_by text[] default array[]::text[],
    pending_submissions text[] default array[]::text[],
    date_created timestamp with time zone default now(),
    date_available timestamp with time zone default now(),
    date_expires timestamp with time zone default now() + interval '1 day',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create submissions table
create table if not exists public.submissions (
    id uuid primary key default uuid_generate_v4(),
    quest_id uuid references public.quests(id) on delete cascade,
    wallet_address text references public.players(wallet_address) on delete cascade,
    status text not null check (status in ('pending', 'approved', 'rejected')),
    proof_url text,
    submission_date timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Add RLS policies
alter table public.players enable row level security;
alter table public.quests enable row level security;
alter table public.submissions enable row level security;

-- Players policies
create policy "Players can view all players"
    on public.players for select
    using (true);

create policy "Players can update their own profile"
    on public.players for update
    using (wallet_address = auth.jwt() ->> 'sub');

create policy "Players can insert their own profile"
    on public.players for insert
    with check (wallet_address = auth.jwt() ->> 'sub');

-- Quests policies
create policy "Anyone can view quests"
    on public.quests for select
    using (true);

create policy "Admins can insert quests"
    on public.quests for insert
    with check (admin_only());

create policy "Admins can update quests"
    on public.quests for update
    using (admin_only());

create policy "Admins can delete quests"
    on public.quests for delete
    using (admin_only());

-- Submissions policies
create policy "Anyone can view submissions"
    on public.submissions for select
    using (true);

create policy "Players can submit their own submissions"
    on public.submissions for insert
    with check (wallet_address = auth.jwt() ->> 'sub');

create policy "Players can update their own submissions"
    on public.submissions for update
    using (wallet_address = auth.jwt() ->> 'sub');

create policy "Admins can manage all submissions"
    on public.submissions for all
    using (admin_only());

-- Create indexes for better performance
create index if not exists idx_submissions_quest_id on public.submissions(quest_id);
create index if not exists idx_submissions_wallet_address on public.submissions(wallet_address);
create index if not exists idx_submissions_status on public.submissions(status);

-- Create triggers for updated_at
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

drop trigger if exists set_submissions_updated_at on public.submissions;
create trigger set_submissions_updated_at
    before update on public.submissions
    for each row
    execute function public.handle_updated_at();
