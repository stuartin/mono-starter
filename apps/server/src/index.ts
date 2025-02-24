import type { Context } from "#lib/yoga";

import { yoga } from "#lib/yoga";

export default {
    // Must have this fetch function
    // Otherwise vitest fails
    // Borrowed from: https://github.com/the-guild-org/yoga-cloudflare-workers-template/blob/master/src/index.ts
    async fetch(request: Request, env: Context, _ctx: ExecutionContext): Promise<Response> {
        return yoga.fetch(request, env);
    },
};
