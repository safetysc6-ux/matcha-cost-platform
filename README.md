# Matcha Cost Calculator Platform

Production-ready mobile-first React + Vite platform for matcha recipe costing, community discovery, affiliate monetization, and analytics.

## Stack
- React + TypeScript + Vite
- TailwindCSS + Framer Motion
- React Router
- Zustand
- Supabase (Auth, PostgreSQL, Storage, RLS)
- Vercel static hosting

## Setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy environment file
   ```bash
   cp .env.example .env
   ```
3. Fill values:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Run development server
   ```bash
   npm run dev
   ```

## Supabase
- SQL schema: `supabase/migrations/001_init.sql`
- Includes tables, indexes, relations, triggers-ready structure, and base RLS policies.

## Vercel Deployment
- `vercel.json` handles SPA rewrites.
- Build command: `npm run build`
- Output directory: `dist`

## Features Included
- Mobile-first dark UI with bottom tab nav and glassmorphism cards
- Auth foundation: login/signup/social/forgot-password/persisted session
- Protected routing
- Realtime cost calculator core logic
- Recipe/community/analytics page foundations
- AI service architecture placeholders
- PWA files: manifest + service worker + robots + sitemap

## Folder Structure
```
src/
  app/
  pages/
  features/
  components/
  layouts/
  hooks/
  store/
  services/
  lib/
  utils/
  assets/
  styles/
```

## Production Guide
- Configure Supabase OAuth providers (Google/LINE) and redirect URLs.
- Extend RLS policies per business rules.
- Add Storage buckets for recipe images.
- Set custom domain + analytics in Vercel.
- Run lighthouse + bundle analysis before launch.
