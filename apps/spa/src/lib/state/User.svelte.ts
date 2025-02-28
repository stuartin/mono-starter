import { client } from "$lib/graphql/client";
import { MutationLogin, MutationLogout } from "$lib/graphql/mutations";
import { QueryMe } from "$lib/graphql/queries";
import type { ResultOf, VariablesOf } from "@mono/shared/graphql";
import { CombinedError, createRequest, type OperationContext } from "@urql/core";
import { getContext, setContext } from "svelte"

export class UserState {

    data = $state<ResultOf<typeof QueryMe>['me'] | undefined>(undefined)
    error = $state<CombinedError | undefined>(undefined)

    constructor() {
        this.#me()
    }

    async #me(context?: Partial<OperationContext>) {
        const { data, error } = await client.query(QueryMe, {}, context).toPromise()
        console.log({ data, error })
        this.data = data?.me
        this.error = error
    }

    async login({ input }: VariablesOf<typeof MutationLogin>) {
        await client.mutation(MutationLogin, { input }).toPromise()
        await this.#me()
    }

    async logout() {
        await client.mutation(MutationLogout, {}).toPromise()
        await this.#me({ requestPolicy: 'network-only' })
    }
}

const KEY = Symbol("UserState")

export function setUserState() {
    return setContext(KEY, new UserState())
}

export function getUserState() {
    return getContext<ReturnType<typeof setUserState>>(KEY)
}