import { drizzle } from "#lib/db";
import { getPlatformProxy } from "wrangler";

import { mock } from "./mock";
import { seed } from "./seed";

async function main() {
    const platform = await getPlatformProxy<CloudflareBindings>();
    const db = drizzle(platform.env.DB);

    console.log("seed...");
    await seed(db);
    console.log("mock...");
    await mock(db);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        process.exit(0);
    });
