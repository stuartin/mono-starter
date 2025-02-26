import type { YogaInitialContext } from "graphql-yoga";
import { createYoga } from "graphql-yoga";
import { initContextCache } from "@pothos/core";
import { useCookies } from '@whatwg-node/server-plugin-cookies'
import { schema } from "#lib/gql/schema";
import { DB, drizzle } from "#lib/db";
import { validateSessionTokenCookie } from "#features/auth/cookie";
import { AuthContext } from "#features/auth/context";

export type Context = YogaInitialContext & CloudflareBindings & AuthContext & {
    db: DB;
};

export const yoga = createYoga<CloudflareBindings>({
    schema,
    maskedErrors: false,
    landingPage: false,
    context: async (ctx) => {
        const db = drizzle(ctx.DB)
        const authContext = await validateSessionTokenCookie(db, ctx.request.cookieStore)

        return {
            db,
            ...authContext,
            ...initContextCache(),
        }
    },
    plugins: [
        useCookies()
    ]
});
