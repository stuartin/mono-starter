import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    schema: "./src/lib/db/schema.ts",
    out: "./src/lib/db/migrations",
    driver: "d1-http",
    casing: 'snake_case',
    dbCredentials: {
        accountId: process.env.CLOUDFLARE_D1_ACCOUNT_ID!,
        databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID!,
        token: process.env.CLOUDFLARE_D1_API_TOKEN!,
    },
});
