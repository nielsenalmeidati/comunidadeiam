# Supabase Setup Guide — Comunidade do IAM

## 1. Create Supabase project
1. Go to https://supabase.com → New Project
2. Copy your project URL and keys to `.env.local`

## 2. Run migrations
In your Supabase dashboard → SQL Editor, paste and run:
`supabase/migrations/001_initial_schema.sql`

Or use Supabase CLI:
```bash
npx supabase db push
```

## 3. Configure Clerk Webhook
1. Go to Clerk Dashboard → Webhooks → Add Endpoint
2. URL: `https://yourdomain.com/api/webhooks/clerk`
3. Events to subscribe: `user.created`, `user.updated`, `user.deleted`
4. Copy the Signing Secret → add to `.env.local` as `CLERK_WEBHOOK_SECRET`

## 4. Enable Realtime (optional, for live community feed)
In Supabase Dashboard → Database → Replication:
- Enable realtime for `posts` and `comments` tables

## 5. Required env variables
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CLERK_WEBHOOK_SECRET=whsec_...
```
