import { goto } from "$app/navigation";
import { page } from "$app/state";
import { client } from "$lib/graphql/client";
import { MutationLogin, MutationLogout, MutationRegister } from "$lib/graphql/mutations";
import type { QueryMe } from "$lib/graphql/queries";
import { GraphQLError } from "@mono/server/src/lib/gql/errors";
import type { ResultOf } from "@mono/shared/graphql";
import { setContext, getContext } from "svelte";

export class Auth {
    static SESSION_STORAGE_KEY = "user"
    static redirectToLogin() {
        const url = new URL(`/auth/login?redirect=${page.url.pathname}`, page.url.origin)
        goto(url)
    }

    user: ResultOf<typeof QueryMe>['me'] | undefined = $state()

    constructor() {
        const _user = window.sessionStorage.getItem(Auth.SESSION_STORAGE_KEY)
        if (_user) {
            this.user = JSON.parse(atob(_user))
            window.sessionStorage.removeItem(Auth.SESSION_STORAGE_KEY)
        }
    }

    async login(email: string, password: string) {
        try {
            const _user = await client.mutation(MutationLogin, { input: { email, password } }).toPromise();
            this.user = _user.data?.login

            const redirect = page.url.searchParams.get("redirect") ?? "/";
            goto(redirect);
        } catch (error) {
            if (error instanceof GraphQLError) {
                console.error(error.message)
            }
        }
    }

    async logout() {
        try {
            const _user = await client.mutation(MutationLogout, {}).toPromise();
            console.log(_user)
            this.user = undefined
            console.log(this.user)
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