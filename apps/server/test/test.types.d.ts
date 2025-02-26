import { Session, User } from "#features/auth/context";
import { DB } from "#lib/db";
import type * as schema from "#lib/db/schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { YogaInitialContext } from "graphql-yoga";

// We cant re-use #lib/yoga Context because it contains a Union from AuthContext
// Typescript cant handle extending an interface with a Union
type TestContext = YogaInitialContext & CloudflareBindings & {
    user?: User
    session?: Session
    db: DB
    MIGRATIONS: D1Migration[];
}

declare module "cloudflare:test" {
    interface ProvidedEnv extends TestContext { }
}

declare global {
    // eslint-disable-next-line vars-on-top, no-var
    var _testState: {
        db: DB
    };
}
