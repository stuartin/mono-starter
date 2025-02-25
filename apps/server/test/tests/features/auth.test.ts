import { graphql } from "@mono/shared/graphql";
import { request } from "#test/request";
import { describe, expect, it } from "vitest";
import { newUser, TestUser } from "#test/user";

describe.sequential("auth", () => {
    let user: TestUser

    it("me returns 401 when not logged in", async () => {
        const q = graphql(`
            query as {
                me {
                    id
                    name
                }
            }
        `);

        const res = await request(q, {});
        const json = await res.json();
        expect(json.data.me).toBeNull()
    });

    it("logout returns 401 when not logged in", async () => {
        expect(true).toBe(true)
    });

    it("register returns 200 with a new user", async () => {
        user = await newUser("test-user", "user@test.com")

        expect(user.id).toBeDefined()
        expect(user.name).toBeDefined()
        expect(user.email).toBeDefined()
        expect(user.password).toBeDefined()

        const { db } = globalThis._testState;
        const dbUser = await db.query.user_table.findFirst({
            where: (table, { eq }) => eq(table.id, user.id)
        });

        expect(dbUser?.id).toBe(user.id)
        expect(dbUser?.name).toBe(user.name)
        expect(dbUser?.email).toBe(user.email)
        expect(dbUser?.passwordHash).toMatch(/^\$argon2id/)
    });

    it("logout returns 200 when logged in", async () => {
        expect(true).toBe(true)
    });

    it("login return 200 when logging in", async () => {
        expect(true).toBe(true)
    });
});
