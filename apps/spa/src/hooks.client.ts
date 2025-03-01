import { Auth } from '$lib/auth/auth.svelte';
import { client } from '$lib/graphql/client';
import { QueryMe } from '$lib/graphql/queries';
import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {
    const { data } = await client.query(QueryMe, {}).toPromise()
    if (data?.me) {
        window.sessionStorage.setItem(Auth.SESSION_STORAGE_KEY, btoa(JSON.stringify(data.me)))
    }
};