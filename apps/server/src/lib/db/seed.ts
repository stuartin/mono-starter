import type { SQL } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";

import * as schema from "#lib/db/schema";
import { getTableColumns, sql } from "drizzle-orm";

export async function seed(db: DrizzleD1Database<typeof schema>) {
    // add batchInsert commands here
}

// Helper function due to limitations on bulk inserts on d1
// https://github.com/drizzle-team/drizzle-orm/issues/2479#issuecomment-2254352608
async function batchInsert<T>(_db: DrizzleD1Database<typeof schema>, table: any, items: T[], chunkSize = 32) {
    for (let i = 0; i < items.length; i += chunkSize) {
        const content = items.slice(i, i + chunkSize);

        await _db.insert(table).values(content).onConflictDoUpdate({
            target: table.id,
            set: conflictUpdateAllExcept(table, ["id"]),
        });
    }
}

// Helper function for conflict updates
// https://github.com/drizzle-team/drizzle-orm/issues/1728#issuecomment-2148635569
function conflictUpdateAllExcept<
    T extends SQLiteTable,
    E extends (keyof T["$inferInsert"])[],
>(table: T, except: E) {
    const columns = getTableColumns(table);
    const updateColumns = Object.entries(columns).filter(
        ([col]) => !except.includes(col as keyof typeof table.$inferInsert),
    );

    return updateColumns.reduce(
        (acc, [colName, table]) => ({
            ...acc,
            [colName]: sql.raw(`excluded.${table.name}`),
        }),
        {},
    ) as Omit<Record<keyof typeof table.$inferInsert, SQL>, E[number]>;
}
