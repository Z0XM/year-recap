# HowWasYourDay?

Read **[About](https://website/about)** for more information

## Installation

1. [NodeJs v20](https://nodejs.org/en/download)
2. [pnpm](https://pnpm.io/installation)

## Setup

### Supabase

This project uses  **[Supabase](https://supabase.com/)** as a backend.

- Use existing shared alpha version
   1. Contact `z0xm.dev@gmail.com` for API keys
   2. Add API keys to `.env.local` file

- Link with your own project
   1. Create a new project on your supabase account
   2. Goto `Authentication > Providers > Email` & Turn off 'Confirm Email', 'Secure email change' and 'Secure password change'
   3. Goto Sql Editor & Run these Sql scripts to setup the database

      ```sql
      create table
        public.users (
            id uuid not null default gen_random_uuid (),
            created_at timestamp with time zone not null default now(),
            display_name text not null,
            email text not null,
            "isActive" boolean not null default true,
            constraint users_pkey primary key (id)
        ) tablespace pg_default;          
      ```

      ```sql
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

      create unique index if not exists single_day_data on public.day_data using btree (day_int, user_id) tablespace pg_default;
      ```

      ```sql
      create function public.handle_new_user()
        returns trigger as $$
        begin
            insert into public.users (id, email, display_name)
            values (new.id, new.email, new.raw_user_meta_data->>'display_name');
            return new;
        end;
        $$ language plpgsql security definer;
      create trigger on_auth_user_created
        after insert on auth.users
        for each row execute procedure public.handle_new_user();
      ```

   4. Go to connect & select `AppFrameworks > Next.js.` Copy the `.env.local` file.

### Environment Setup

1. Create a file at the root directory as `.env.local`
2. Paste the values copied from Supabase connection

### Getting Started

1. `pnpm i`
2. `pnpm dev`
3. Visit `localhost:3000`
4. Get started with /feature-list