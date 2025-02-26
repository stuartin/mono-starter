import { DB } from "#lib/db";
import { AuthContext } from "../auth.context";
import { validateSessionToken } from "./session";

export async function setSessionTokenCookie(store: Request["cookieStore"], token: string, expires: Date): Promise<void> {
    await store?.set({
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

export async function deleteSessionTokenCookie(store: Request["cookieStore"]): Promise<void> {
    await store?.set({
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

export async function validateSessionTokenCookie(db: DB, store: Request["cookieStore"]): Promise<AuthContext> {
    let result: AuthContext = {
        user: null,
        session: null
    }

    // No session
    const token = await store?.get("session");
    if (!token) return result

    result = await validateSessionToken(db, token.value);

    // Invalid session
    if (result.session === null) {
        await deleteSessionTokenCookie(store);
        return result
    }

    // Valid session
    await setSessionTokenCookie(store, token.value, result.session.expiresAt);
    return result
}