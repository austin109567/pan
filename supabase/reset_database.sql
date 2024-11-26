-- Drop existing tables if they exist
drop table if exists public.submissions cascade;
drop table if exists public.quests cascade;
drop table if exists public.quest_completions cascade;
drop table if exists public.players cascade;

-- Create admin_only function
create or replace function public.admin_only() returns boolean as $$
begin
  return (
    -- Check if user has admin role
    (auth.jwt() ->> 'role')::text = 'admin'
    or
    -- Check if user has admin flag
    (auth.jwt() ->> 'is_admin')::boolean = true
    or
    -- Check if user has admin wallet address from user metadata
    (auth.jwt() -> 'user_metadata' ->> 'wallet_address')::text = '8jN1XtgiuWeyNjzysYVqGZ1mPAG37sjmuCTnENz66wrs'
  );
end;
$$ language plpgsql security definer;

-- Create players table
create table if not exists public.players (
    id uuid primary key default uuid_generate_v4(),
    wallet_address text unique not null,
    user_id text,
    username text,
    xp integer default 0,
    quests_completed integer default 0,
    raid_bosses_defeated integer default 0,
    show_wallet boolean default true,
    date_joined timestamp with time zone default now(),
    last_quest_completion_time timestamp with time zone,
    archetype text,
    discord_handle text,
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
    image_url text,
    status text not null check (status in ('available', 'completed', 'expired')) default 'available',
    date_created timestamp with time zone default now(),
    date_available timestamp with time zone default now(),
    date_expires timestamp with time zone default now() + interval '1 day',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create submissions table
create table if not exists public.submissions (
    id uuid primary key default uuid_generate_v4(),
    quest_id uuid not null references public.quests(id) on delete cascade,
    wallet_address text not null references public.players(wallet_address) on delete cascade,
    status text not null check (status in ('pending', 'approved', 'rejected')),
    proof_url text,
    quest_type text default 'quest',
    xp_reward integer default 0,
    submission_date timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create quest_completions table to track last completion times
create table if not exists public.quest_completions (
    id uuid primary key default uuid_generate_v4(),
    quest_id uuid not null references public.quests(id) on delete cascade,
    wallet_address text not null references public.players(wallet_address) on delete cascade,
    completion_time timestamp with time zone default now(),
    quest_type text not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(quest_id, wallet_address)
);

-- Add RLS policies
alter table public.players enable row level security;
alter table public.quests enable row level security;
alter table public.submissions enable row level security;
alter table public.quest_completions enable row level security;

-- Players policies
create policy "Players can view all players"
    on public.players for select
    using (true);

create policy "Players can update their own profile"
    on public.players for update
    using (wallet_address = auth.jwt() -> 'user_metadata' ->> 'wallet_address');

create policy "Players can insert their own profile"
    on public.players for insert
    with check (wallet_address = auth.jwt() -> 'user_metadata' ->> 'wallet_address');

create policy "Service role can manage players"
    on public.players for all
    using (auth.jwt() ->> 'role' = 'service_role');

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

create policy "Service role can manage quests"
    on public.quests for all
    using (auth.jwt() ->> 'role' = 'service_role');

-- Submissions policies
create policy "Anyone can view submissions"
    on public.submissions for select
    using (true);

create policy "Players can submit their own submissions"
    on public.submissions for insert
    with check (wallet_address = auth.jwt() -> 'user_metadata' ->> 'wallet_address');

create policy "Players can update their own submissions"
    on public.submissions for update
    using (wallet_address = auth.jwt() -> 'user_metadata' ->> 'wallet_address');

create policy "Service role can manage submissions"
    on public.submissions for all
    using (auth.jwt() ->> 'role' = 'service_role');

-- Quest Completions policies
create policy "Anyone can view quest completions"
    on public.quest_completions for select
    using (true);

create policy "Players can insert their own completions"
    on public.quest_completions for insert
    with check (wallet_address = auth.jwt() -> 'user_metadata' ->> 'wallet_address');

create policy "Service role can manage quest completions"
    on public.quest_completions for all
    using (auth.jwt() ->> 'role' = 'service_role');

create policy "Admins can manage quest completions"
    on public.quest_completions for all
    using (admin_only());

-- Function to check if a quest is on cooldown
create or replace function public.is_quest_on_cooldown(
    p_quest_id uuid,
    p_wallet_address text,
    p_quest_type text
) returns boolean as $$
declare
    last_completion timestamp with time zone;
begin
    select completion_time into last_completion
    from quest_completions
    where quest_id = p_quest_id and wallet_address = p_wallet_address
    order by completion_time desc
    limit 1;

    if last_completion is null then
        return false;
    end if;

    case p_quest_type
        when 'daily' then
            return last_completion > now() - interval '1 day';
        when 'weekly' then
            return last_completion > now() - interval '1 week';
        when 'monthly' then
            return last_completion > now() - interval '1 month';
        else
            return false;
    end case;
end;
$$ language plpgsql security definer;

-- Function to submit a quest
create or replace function public.submit_quest(
    p_quest_id uuid,
    p_wallet_address text,
    p_proof_url text,
    p_submission_date timestamp with time zone
) returns json as $$
declare
    v_quest record;
    v_player record;
    v_existing_submission record;
begin
    -- Get quest details
    select * into v_quest from quests where id = p_quest_id;
    if not found then
        return json_build_object(
            'success', false,
            'message', 'Quest not found'
        );
    end if;

    -- Check if player exists, if not create them
    select * into v_player from players where wallet_address = p_wallet_address;
    if not found then
        insert into players (
            wallet_address,
            xp,
            quests_completed,
            raid_bosses_defeated,
            show_wallet,
            date_joined
        ) values (
            p_wallet_address,
            0,
            0,
            0,
            true,
            now()
        ) returning * into v_player;
    end if;

    -- Check if quest is on cooldown
    if public.is_quest_on_cooldown(p_quest_id, p_wallet_address, v_quest.type) then
        return json_build_object(
            'success', false,
            'message', 'Quest is still on cooldown'
        );
    end if;

    -- Check if player has already completed this quest
    if v_quest.completed_by @> ARRAY[p_wallet_address] then
        return json_build_object(
            'success', false,
            'message', 'You have already completed this quest'
        );
    end if;

    -- Check for existing pending submission
    select * into v_existing_submission 
    from submissions 
    where quest_id = p_quest_id 
    and wallet_address = p_wallet_address 
    and status = 'pending';

    if found then
        return json_build_object(
            'success', false,
            'message', 'You already have a pending submission for this quest'
        );
    end if;

    -- Check if quest is expired
    if v_quest.date_expires < now() then
        return json_build_object(
            'success', false,
            'message', 'This quest has expired'
        );
    end if;

    -- Create submission
    insert into submissions (
        quest_id,
        wallet_address,
        proof_url,
        status,
        quest_type,
        submission_date,
        xp_reward
    ) values (
        p_quest_id,
        p_wallet_address,
        p_proof_url,
        'pending',
        v_quest.type,
        p_submission_date,
        v_quest.xp_reward
    );

    -- Add wallet to pending_submissions array if not already there
    update quests
    set pending_submissions = array_append(pending_submissions, p_wallet_address)
    where id = p_quest_id
    and not pending_submissions @> array[p_wallet_address];

    return json_build_object(
        'success', true,
        'message', 'Quest submission created successfully'
    );
end;
$$ language plpgsql security definer;

-- Function to approve a quest submission
create or replace function public.approve_quest_submission(
    p_submission_id uuid,
    p_quest_id uuid,
    p_wallet_address text,
    p_xp_reward integer,
    p_quest_type text
) returns void as $$
declare
    v_quest record;
begin
    -- Get quest details
    select * into v_quest from quests where id = p_quest_id;
    if not found then
        raise exception 'Quest not found';
    end if;

    -- Begin transaction
    -- Update player XP and stats
    update players
    set xp = xp + p_xp_reward,
        quests_completed = quests_completed + 1,
        last_quest_completion_time = now()
    where wallet_address = p_wallet_address;

    -- Record completion time
    insert into quest_completions (
        quest_id,
        wallet_address,
        quest_type,
        completion_time
    ) values (
        p_quest_id,
        p_wallet_address,
        p_quest_type,
        now()
    );

    -- Update quest completed_by array and status
    update quests
    set completed_by = array_append(completed_by, p_wallet_address),
        pending_submissions = array_remove(pending_submissions, p_wallet_address),
        status = case 
            when v_quest.type = 'daily' then 'available'  -- Daily quests remain available for others
            when v_quest.type = 'weekly' then 'available' -- Weekly quests remain available for others
            when v_quest.type = 'monthly' then 'available' -- Monthly quests remain available for others
            else 'completed' -- Other quest types are marked as completed
        end
    where id = p_quest_id;

    -- Mark submission as approved and update XP reward
    update submissions
    set status = 'approved',
        xp_reward = p_xp_reward,
        updated_at = now()
    where id = p_submission_id;

    -- Update quest status if all pending submissions are processed
    update quests q
    set status = case 
        when array_length(q.pending_submissions, 1) is null 
        and q.date_expires < now() then 'expired'
        else q.status
    end
    where id = p_quest_id;
end;
$$ language plpgsql security definer;

-- Function to reject a quest submission
create or replace function public.reject_quest_submission(
    p_submission_id uuid,
    p_quest_id uuid,
    p_wallet_address text
) returns void as $$
begin
    -- Mark submission as rejected
    update submissions
    set status = 'rejected',
        updated_at = now()
    where id = p_submission_id;

    -- Remove wallet from pending_submissions array
    update quests
    set pending_submissions = array_remove(pending_submissions, p_wallet_address)
    where id = p_quest_id;
end;
$$ language plpgsql security definer;

-- Function to get available quests for a player
create or replace function public.get_available_quests(
    p_wallet_address text,
    p_quest_type text default null
) returns setof quests as $$
begin
    return query
    select q.*
    from quests q
    where (
        -- Quest is not expired
        q.date_expires > now()
        -- Quest is available
        and q.status = 'available'
        -- Player hasn't completed it
        and not (q.completed_by @> array[p_wallet_address])
        -- Player doesn't have a pending submission
        and not (q.pending_submissions @> array[p_wallet_address])
        -- Filter by type if specified
        and (p_quest_type is null or q.type = p_quest_type)
    )
    order by q.date_created desc;
end;
$$ language plpgsql security definer;

-- Create indexes for better performance
create index if not exists idx_submissions_quest_id on public.submissions(quest_id);
create index if not exists idx_submissions_wallet_address on public.submissions(wallet_address);
create index if not exists idx_submissions_status on public.submissions(status);

-- Create triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

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

drop trigger if exists set_quest_completions_updated_at on public.quest_completions;
create trigger set_quest_completions_updated_at
    before update on public.quest_completions
    for each row
    execute function public.handle_updated_at();
