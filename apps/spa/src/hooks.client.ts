import { Auth } from '$lib/auth/auth.svelte';
import { client } from '$lib/graphql/client';
import { QueryMe } from '$lib/graphql/queries';
import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {
    const { data } = await client.query(QueryMe, {}, { requestPolicy: 'network-only' }).toPromise()
    if (data?.me) Auth._init = data.me
};