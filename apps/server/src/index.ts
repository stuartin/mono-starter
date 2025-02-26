import type { Context } from "#lib/yoga";

import { yoga } from "#lib/yoga";

export default {
    // _ctx is used in vitest
    // Borrowed from: https://github.com/the-guild-org/yoga-cloudflare-workers-template/blob/master/src/index.ts
    async fetch(request: Request, env: Context, _ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname.startsWith("/graphql")) {
            return yoga.fetch(request, env);
        }

        return env.ASSETS.fetch(request);
    },
};
