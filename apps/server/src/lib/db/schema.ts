import { createId } from "@paralleldrive/cuid2";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSchemaFactory } from "drizzle-zod";

export const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({
    coerce: {
        date: true,
    },
});


export const user_table = sqliteTable("user", {
    id: text().primaryKey().$defaultFn(() => createId()),
    name: text().notNull(),
    email: text().notNull(),
    passwordHash: text().notNull(),
    updatedAt: integer({ mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdateFn(() => new Date()),
    createdAt: integer({ mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const session_table = sqliteTable("session", {
    id: text().primaryKey(),
    userId: integer().notNull().references(() => user_table.id),
    expiresAt: integer({ mode: "timestamp" }).notNull()
});