# Mono Repo Starter

A basic monorepo starter with some shared config

## @mono/server

## Database

Drizzle is used during local development against the local wrangler/miniflare db only.
D1 databases hosted on Cloudflare all use wrangler to perform migrations.

### Migration workflow
- `pnpm db:init` - Creates a local wrangler db based on the current migrations
- `pnpm db:push` - Update the local db directly during development
- `pnpm db:generate` - Schema changes are finalized and we can start writing tests
- `pnpm test` - Local tests use generated migrations files to bootstrap the database
- `pnpm deploy:stg` - Deploy the migrations and code to staging environment
- `pnpm deploy:prd` - Deploy the migrations and code to the production envrionment

## @mono/spa

## Authentication
- `urql` client has an exchange to check if server returns an `UNAUTHORIZED` error, if it does, redirect to login
  - This also contains logic about what routes to exclude/include from auto redirect to login
- `hooks.client.ts` used to perform an `init` hook to check if user has cookie update auth
- `setAuth()` initialized at root context for other routes 
- If you want to always perform an API request, update the `requestPolicy` to `cache-and-network`

## Proxy

In order to avoid CORS problems when developing locally, we use a vite proxy (`vite.config.ts`) to redirect `/graphql` to the `@mono/server`

## @mono/shared
- eslint
- tsconfig