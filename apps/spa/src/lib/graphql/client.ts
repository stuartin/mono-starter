import { PUBLIC_SERVER_ENDPOINT } from '$env/static/public';
import { Client, debugExchange, fetchExchange, mapExchange } from '@urql/svelte';
import { cacheExchange } from "@urql/exchange-graphcache"
import { devtoolsExchange } from '@urql/devtools';
import { page } from '$app/state';
import { ERR } from "@mono/server/src/lib/gql/errors"
import { redirectToLogin } from '$lib/utils/unauthorized';

export const client = new Client({
    url: PUBLIC_SERVER_ENDPOINT,
    // ORDER MATTERS
    // exchanges: [devtoolsExchange, debugExchange, documentCache, fetchExchange],
    exchanges: [
        devtoolsExchange,
        debugExchange,
        cacheExchange(),
        mapExchange({
            onError(error) {
                const unauthorized = error.graphQLErrors.some((err) => err.extensions.code === ERR.UNAUTHORIZED.extensions.code)
                if (
                    unauthorized &&
                    page.url.pathname !== "/" &&
                    !page.url.pathname.startsWith("/auth/login")
                ) {
                    redirectToLogin()
                }
            },
        }),
        fetchExchange,

    ],
});