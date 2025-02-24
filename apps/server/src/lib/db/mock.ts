import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "#lib/db/schema";
import { seed } from "drizzle-seed";

const SEED_COUNT = 5;

export async function mock(db: DrizzleD1Database<typeof schema>) {


    await seed(
        // @ts-expect-error https://github.com/drizzle-team/drizzle-orm/issues/3599
        db,
        schema,
        { count: SEED_COUNT },
    )
}
