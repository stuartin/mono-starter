import { drizzle as d1Drizzle } from "drizzle-orm/d1";
import * as schema from "#lib/db/schema"

export type DB = ReturnType<typeof drizzle>

export function drizzle(_db: D1Database) {
    return d1Drizzle(_db, { schema, casing: 'snake_case' });
}