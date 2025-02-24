import { AuthContext } from "../auth.context";
import { validateSessionToken } from "./session";

export function setSessionTokenCookie(store: Request["cookieStore"], token: string, expires: Date): void {
    store?.set({
        name: 'session',
        value: token,
        secure: process.env.NODE_ENV === "development" ? false : true,
        expires,
        path: "/",
        sameSite: 'lax',
        httpOnly: true,
        domain: null
    })
}

export function deleteSessionTokenCookie(store: Request["cookieStore"]): void {
    store?.set({
        name: 'session',
        value: undefined,
        secure: process.env.NODE_ENV === "development" ? false : true,
        expires: new Date(),
        path: "/",
        sameSite: 'lax',
        httpOnly: true,
        domain: null
    })
}

export async function validateSessionTokenCookie(store: Request["cookieStore"]): Promise<AuthContext> {
    let result: AuthContext = {
        user: null,
        session: null
    }

    // No session
    const token = await store?.get("session");
    if (!token) return result

    result = await validateSessionToken(token.value);

    // Invalid session
    if (result.session === null) {
        deleteSessionTokenCookie(store);
        return result
    }

    // Valid session
    setSessionTokenCookie(store, token.value, result.session.expiresAt);
    return result
}