import { PUBLIC_SERVER_ENDPOINT } from '$env/static/public';
import { Client, debugExchange, fetchExchange, cacheExchange as documentCache } from '@urql/svelte';
import { cacheExchange } from "@urql/exchange-graphcache"
import { devtoolsExchange } from '@urql/devtools';

export const client = new Client({
    url: PUBLIC_SERVER_ENDPOINT,
    // ORDER MATTERS
    // exchanges: [devtoolsExchange, debugExchange, documentCache, fetchExchange],
    exchanges: [
        devtoolsExchange,
        debugExchange,
        cacheExchange(),
        fetchExchange
    ],
});