# HowWasYourDay?

Read **[About](https://website/about)** for more information

## Tech Stack

1. [NodeJs v20](https://nodejs.org/en/download)
2. [pnpm](https://pnpm.io/installation)
3. [NextJS](https://nextjs.org/docs)
4. [Supabase](https://supabase.com/)
5. [Resend](https://resend.com/)
6. [Vercel](https://vercel.com/)

## Installation

1. [NodeJs v20](https://nodejs.org/en/download)
2. [pnpm](https://pnpm.io/installation)

## Setup

### Supabase

This project uses  **[Supabase](https://supabase.com/)** as a backend.

<!-- You can choose any of the below mentioned below

- Use existing shared alpha version
   1. Contact `z0xm.dev@gmail.com` for API keys
   2. Add API keys to `.env.local` file -->

- Link with your own project
   1. Create an organization or use an existing one to add a new project on your supabase account
   2. Goto `Authentication > Providers > Email` & Turn off 'Confirm Email', 'Secure email change' and 'Secure password change'
   3. Goto Sql Editor & Run the sql scripts in file `/src/lib/supabase/setup.sql` to setup the database
   4. Go to connect & select `AppFrameworks > Next.js.` Copy the `.env.local` file.
   5. Create a file at the root directory in `.env.local`
   6. Paste the values copied from Supabase connection

### Resend

1. Follow this guide [Resend With NextJS](https://resend.com/docs/send-with-nextjs)
2. Add resend key as `RESEND_API_KEY=<YOUR_API_KEY>` in `.env.local`

<!-- ## Cron Auth

1. Generate a random secret key by yourself or use any online tool like [Generate Key](https://acte.ltd/utils/randomkeygen)
2.  -->

### Getting Started

1. `pnpm i`
2. `pnpm dev`
3. Visit `localhost:3000`
4. Get started with /feature-list in project directory 