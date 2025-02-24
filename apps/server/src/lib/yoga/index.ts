import type { YogaInitialContext } from "graphql-yoga";
import { createYoga } from "graphql-yoga";
import { initContextCache } from "@pothos/core";

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
    context: async ctx => ({
        ...initContextCache(),
        ...(await validateSessionTokenCookie(ctx.request.cookieStore)),
        db: drizzle(ctx.DB),
    }),
});
