import { goto } from "$app/navigation"
import { page } from "$app/state"

export function redirectToLogin() {
    const url = new URL(`/auth/login?redirect=${page.url.pathname}`, page.url.origin)
    goto(url)
}