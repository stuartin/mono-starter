import { client } from "$lib/graphql/client";
import { QueryMe } from "$lib/graphql/queries";
import { queryStore, } from "@urql/svelte";
import { setContext, getContext } from "svelte";

export class Queries {

    queryMe = queryStore({
        client,
        query: QueryMe,
        context: { requestPolicy: 'cache-and-network' }
    })

}

const KEY = Symbol("API")

export function setAPI() {
    return setContext(KEY, new Queries())
}

export function getAPI() {
    return getContext<ReturnType<typeof setAPI>>(KEY)
}