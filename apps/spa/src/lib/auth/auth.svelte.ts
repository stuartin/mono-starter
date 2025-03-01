import { goto } from "$app/navigation";
import { page } from "$app/state";
import { client } from "$lib/graphql/client";
import { MutationLogin, MutationLogout, MutationRegister } from "$lib/graphql/mutations";
import { QueryMe } from "$lib/graphql/queries";
import { GraphQLError } from "@mono/server/src/lib/gql/errors";
import type { ResultOf } from "@mono/shared/graphql";
import { setContext, getContext } from "svelte";

export class Auth {
    static _init: ResultOf<typeof QueryMe>['me'] | undefined
    static _stale: boolean
    static SESSION_STORAGE_KEY = "user"
    static redirectToLogin(unauthorized: boolean) {
        if (
            unauthorized &&
            page.url.pathname !== "/" &&
            !page.url.pathname.startsWith("/auth/")
        ) {
            const url = new URL(`/auth/login?redirect=${page.url.pathname}`, page.url.origin)
            goto(url)
        }
    }

    user: ResultOf<typeof QueryMe>['me'] | undefined = $state()

    constructor() {
        if (Auth._init) {
            this.user = Auth._init
            Auth._init = undefined
        }
    }

    async login(email: string, password: string) {
        try {
            const redirect = page.url.searchParams.get("redirect") ?? "/";

            const _user = await client.mutation(MutationLogin, { input: { email, password } }).toPromise();
            this.user = _user.data?.login
            Auth._stale = false

            goto(redirect);
        } catch (error) {
            if (error instanceof GraphQLError) {
                console.error(error.message)
            }
        }
    }

    async logout() {
        try {
            await client.mutation(MutationLogout, {}).toPromise();
            this.user = undefined
            goto("/");
        } catch (error) {
            if (error instanceof GraphQLError) {
                console.error(error.message)
            }
        }
    }

    async register(name: string, email: string, password: string) {
        try {
            const _user = await client.mutation(MutationRegister, { input: { name, email, password } }).toPromise();
            this.user = _user.data?.register
            Auth._stale = false

            goto("/profile");
        } catch (error) {
            if (error instanceof GraphQLError) {
                console.error(error.message)
            }
        }
    }


}

const KEY = Symbol("AUTH")

export function setAuth() {
    return setContext(KEY, new Auth())
}

export function getAuth() {
    return getContext<ReturnType<typeof setAuth>>(KEY)
}