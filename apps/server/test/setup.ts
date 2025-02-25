import { drizzle } from "#lib/db";
import { seed } from "#lib/db/seed";
import { applyD1Migrations, env } from "cloudflare:test";

globalThis._testState = globalThis._testState ?? {
    db: drizzle(env.DB),
};

await applyD1Migrations(env.DB, env.MIGRATIONS);
await seed(globalThis._testState.db);
