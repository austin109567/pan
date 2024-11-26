-- Create the quests table
create table if not exists public.quests (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text not null,
    type text not null check (type in ('daily', 'weekly', 'monthly')),
    xp_reward integer not null default 0,
    completed_by text[] default array[]::text[],
    date_created timestamp with time zone default timezone('utc'::text, now()) not null,
    date_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS but allow all operations for now
alter table public.quests enable row level security;
create policy "Enable all operations for quests"
    on public.quests
    for all
    using (true)
    with check (true);

-- Insert sample quests
INSERT INTO public.quests (title, description, type, xp_reward) VALUES
-- Daily Quests
('Daily Twitter Engagement', 'Share a tweet about RaidRally and get 3 likes', 'daily', 100),
('Discord Activity', 'Send 5 messages in our Discord community', 'daily', 50),
('Daily Trade', 'Complete a trade on our marketplace', 'daily', 150),

-- Weekly Quests
('Community Champion', 'Help 3 new members in Discord', 'weekly', 500),
('Content Creator', 'Create and share a RaidRally meme', 'weekly', 300),
('Trading Pro', 'Complete 5 trades in a week', 'weekly', 400),

-- Monthly Quests
('Diamond Hands', 'Hold a legendary item for 30 days', 'monthly', 1000),
('Community Leader', 'Organize a community event', 'monthly', 1500),
('Trading Legend', 'Complete 50 trades in a month', 'monthly', 2000);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.date_updated = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger handle_updated_at
    before update
    on public.quests
    for each row
    execute function public.handle_updated_at();
