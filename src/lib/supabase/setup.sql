
-- create users table
create table
public.users (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    display_name text not null,
    email text not null,
    "isActive" boolean not null default true,
    constraint users_pkey primary key (id)
) tablespace pg_default;          

-- create day_data table
create table
public.day_data (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    metadata json null,
    user_id uuid not null,
    day_int bigint not null,
    constraint day_data_pkey primary key (id),
    constraint day_data_user_id_fkey foreign key (user_id) references users (id)
) tablespace pg_default;

-- add a unique index on day_int, user_id on day_data
create unique index if not exists single_day_data on public.day_data using btree (day_int, user_id) tablespace pg_default;

-- create a trigger to setup a user in users table whenever a new user signs up.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name');
  return new;

  insert into public.user_reminder_settings (user_id)
  values (new.id);
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- enable aggregation queries on db
ALTER ROLE authenticator SET pgrst.db_aggregates_enabled = 'true';
NOTIFY pgrst, 'reload config';

-- create user_reminder_settings table
create table
  public.user_reminder_settings (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    enable_daily boolean not null default true,
    enable_weekly boolean not null default true,
    enable_monthly boolean not null default true,
    user_id uuid not null,
    constraint user_reminder_settings_pkey primary key (id),
    constraint user_reminder_settings_user_id_fkey foreign key (user_id) references users (id)
  ) tablespace pg_default;

-- migration query to seed existing users
insert into public.user_reminder_settings (user_id) (select id as user_id from users);

