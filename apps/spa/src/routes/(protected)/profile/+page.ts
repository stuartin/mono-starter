import { client } from "$lib/graphql/client";
import { QueryMe } from "$lib/graphql/queries";
import { queryStore } from "@urql/svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    return {
        me: queryStore({
            client,
            query: QueryMe,
        })
    }
}