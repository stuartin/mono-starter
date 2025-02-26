import { graphql } from "@mono/shared/graphql";
import { request } from "#test/request";
import { describe, expect, it } from "vitest";
import { genEmail, genName, genPassword, MutationRegister, newUser } from "#test/user";
import { ERR } from "#lib/gql/errors";

const QueryMe = graphql(`
    query Me {
        me {
            id
            name
        }
    }
`);

const MutationLogin = graphql(`
    mutation Login($input: MutationLoginInput!) {
        login(
            input: $input
        ) {
            id
            name
        }
    }
`)

const MutationLogout = graphql(`
    mutation Logout {
        logout
    }
`)

describe("auth", () => {
    it("register returns 500 when email already exists", async () => {
        const { input, name } = await newUser()

        const res = await request(MutationRegister, { input: { name: "duplicate", ...input } });
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json.data.register).toBeNull();
        expect(json.errors).toHaveLength(1);
        expect(json.errors).toMatchObject([{ extensions: { code: ERR.SERVER.extensions.code } }])
    })

    it("register returns 400 when password doesnt meet requirements", async () => {
        const RegisterInput = {
            name: genName(),
            email: genEmail(),
            password: "invalid"
        }

        const res = await request(MutationRegister, { input: RegisterInput });
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json.data.register).toBeNull();
        expect(json.errors?.length).toBeGreaterThan(0);
        expect(json.errors).toMatchObject([{ extensions: { code: ERR.INVALID.extensions.code } }])
    })

    it("register returns 200 when valid", async () => {
        const RegisterInput = {
            name: genName(),
            email: genEmail(),
            password: genPassword()
        }

        const res = await request(MutationRegister, { input: RegisterInput });
        const json = await res.json();
        const { register } = json.data

        expect(res.status).toBe(200);
        expect(register?.id).toBeDefined()
        expect(register?.name).toBeDefined()

        const { db } = globalThis._testState;
        const dbUser = await db.query.user_table.findFirst({
            where: (table, { eq }) => eq(table.id, register!.id!)
        });

        expect(dbUser?.id).toBe(register?.id)
        expect(dbUser?.name).toBe(register?.name)
        expect(dbUser?.email).toBe(RegisterInput.email)
        expect(dbUser?.passwordHash).toMatch(/^\$argon2id/)
    });

    it("login return 200 when logging in", async () => {
        const { input } = await newUser()

        const res = await request(MutationLogin, { input });
        const json = await res.json();
        const { login } = json.data

        expect(res.status).toBe(200);
        expect(login?.id).toBeDefined()
        expect(login?.name).toBeDefined()
    });

    it("me returns 401 when not logged in", async () => {
        const res = await request(QueryMe, {});
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.data.me).toBeNull();
        expect(json.errors).toHaveLength(1);
        expect(json.errors).toMatchObject([{ extensions: { code: ERR.UNAUTHORIZED.extensions.code } }])
    });

    it("me returns 200 when logged in", async () => {
        const { cookie } = await newUser()

        const res = await request(QueryMe, {}, cookie);
        const json = await res.json();
        const { me } = json.data

        expect(res.status).toBe(200);
        expect(me?.id).toBeDefined()
        expect(me?.name).toBeDefined()
    });

    it("logout returns 401 when not logged in", async () => {
        const res = await request(MutationLogout, {});
        const json = await res.json();

        expect(res.status).toBe(401);
        expect(json.errors).toHaveLength(1);
        expect(json.errors).toMatchObject([{ extensions: { code: ERR.UNAUTHORIZED.extensions.code } }])
    });

    it("logout returns 200 when logged in", async () => {
        const { cookie, id } = await newUser()

        const { db } = globalThis._testState;
        const beforeSession = await db.query.session_table.findFirst({
            where: (table, { eq }) => eq(table.userId, id)
        });
        expect(beforeSession).toBeDefined()

        const res = await request(MutationLogout, {}, cookie);
        const json = await res.json();
        const { logout } = json.data

        expect(res.status).toBe(200);
        expect(logout).toBe(true)

        const afterSession = await db.query.session_table.findFirst({
            where: (table, { eq }) => eq(table.id, beforeSession!.id)
        });
        expect(afterSession).toBeUndefined()
    });
});
