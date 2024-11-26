-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Set up storage
insert into storage.buckets (id, name)
values ('avatars', 'avatars')
on conflict do nothing;

-- Drop existing functions if they exist
drop function if exists public.admin_only();
drop function if exists public.handle_updated_at();

-- Create admin check function
create function public.admin_only()
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
create function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
