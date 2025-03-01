import { client } from '$lib/graphql/client';
import { QueryMe } from '$lib/graphql/queries';
import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {
    // validate session
    await client.query(QueryMe, {}).toPromise()
};