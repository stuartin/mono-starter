import { user_table } from "#lib/db/schema";
import { builder } from "#lib/gql/builder";
import { GraphQLError } from "graphql/error";
import { z } from "zod"
import { ERR } from "#lib/gql/errors";
import { hashPassword, verifyPasswordHash } from "./lib/password";
import { setSessionTokenCookie, deleteSessionTokenCookie } from "./lib/cookie";
import { generateSessionToken, createSession, invalidateSession } from "./lib/session";

export const PasswordZod = z
    .string()
    .min(8, 'Minimum 8 character(s)')
    .refine((value) => /[a-z]{1,}/.test(value), 'Minimum 1 lowercase character(s)')
    .refine((value) => /[A-Z]{1,}/.test(value), 'Minimum 1 uppercase character(s)')
    .refine((value) => /[!@#$%^&*()\-__+.]{1,}/.test(value), 'Minimum 1 special character(s)');

export const User = builder.drizzleObject("user_table", {
    name: "User",
    description: "User",
    fields: t => ({
        id: t.exposeID("id"),
        createdAt: t.expose("createdAt", { type: "DateTime" }),
        updatedAt: t.expose("updatedAt", { type: "DateTime" }),
        name: t.exposeString("name"),
    }),
});

builder.queryFields(t => ({
    me: t.withAuth({
        user: true
    }).field({
        type: User,
        resolve: async (root, args, ctx) => {
            return ctx.user;
        }
    })
}));

builder.mutationFields(t => ({
    register: t.fieldWithInput({
        type: User,
        validate: {
            schema: z.object({
                input: z.object({
                    name: z.string().min(3),
                    email: z.string().email(),
                    password: PasswordZod
                })
            })
        },
        input: {
            name: t.input.string(),
            email: t.input.string(),
            password: t.input.string(),
        },
        resolve: async (root, { input }, ctx) => {
            const REGISTER_ERROR = new GraphQLError("An error occurred, please try again later.", ERR.SERVER)

            // Check for existing
            const existingUser = await ctx.db.query.user_table.findFirst({
                where: (f, { eq }) => eq(f.email, input.email)
            })
            if (existingUser) throw REGISTER_ERROR


            // Create user
            const passwordHash = await hashPassword(input.password, ctx);
            const [user] = await ctx.db.insert(user_table).values({
                name: input.name,
                email: input.email,
                passwordHash
            }).returning()

            // Create a session
            const token = generateSessionToken();
            const session = await createSession(ctx.db, token, user.id);
            setSessionTokenCookie(ctx.request.cookieStore, token, session.expiresAt);

            return user;
        }
    }),
    login: t.fieldWithInput({
        type: User,
        validate: {
            schema: z.object({
                input: z.object({
                    email: z.string().email(),
                    password: PasswordZod
                })
            })
        },
        input: {
            email: t.input.string(),
            password: t.input.string(),
        },
        resolve: async (root, { input }, ctx) => {
            const LOGIN_ERROR = new GraphQLError("Invalid username or password.", ERR.UNAUTHORIZED)

            // Get User
            const user = await ctx.db.query.user_table.findFirst({
                where: (f, { eq }) => eq(f.email, input.email)
            })
            if (!user) throw LOGIN_ERROR

            // Validate Password
            const validPassword = await verifyPasswordHash(user.passwordHash, input.password, ctx);
            if (!validPassword) throw LOGIN_ERROR

            // Create a session
            const token = generateSessionToken();
            const session = await createSession(ctx.db, token, user.id);
            setSessionTokenCookie(ctx.request.cookieStore, token, session.expiresAt);

            return user
        }
    }),
    logout: t.withAuth({
        user: true
    }).field({
        type: "Boolean",
        unauthorizedError: () => new GraphQLError("Not logged in.", ERR.UNAUTHORIZED),
        resolve: async (root, args, ctx) => {
            invalidateSession(ctx.db, ctx.session.id);
            deleteSessionTokenCookie(ctx.request.cookieStore);

            return true;
        }
    })

}))