import { PUBLIC_SERVER_ENDPOINT } from '$env/static/public';
import { Client, cacheExchange, fetchExchange } from '@urql/svelte';

export const client = new Client({
    url: PUBLIC_SERVER_ENDPOINT,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: () => ({
        credentials: 'include'
    })
});