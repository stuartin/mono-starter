import { user_table, session_table } from "#lib/db/schema";
import { eq } from "drizzle-orm";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { AuthContext, Session } from "../auth.context";
import { DB } from "#lib/db";


export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export async function createSession(db: DB, token: string, userId: string): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    };
    await db.insert(session_table).values(session);
    return session;
}

export async function validateSessionToken(db: DB, token: string): Promise<AuthContext> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const result = await db
        .select({ user: user_table, session: session_table })
        .from(session_table)
        .innerJoin(user_table, eq(session_table.userId, user_table.id))
        .where(eq(session_table.id, sessionId));
    if (result.length < 1) {
        return { session: null, user: null };
    }
    const { user, session } = result[0];
    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(session_table).where(eq(session_table.id, session.id));
        return { session: null, user: null };
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await db
            .update(session_table)
            .set({
                expiresAt: session.expiresAt
            })
            .where(eq(session_table.id, session.id));
    }
    return { session, user };
}

export async function invalidateSession(db: DB, sessionId: string): Promise<void> {
    await db.delete(session_table).where(eq(session_table.id, sessionId));
}

export async function invalidateAllSessions(db: DB, userId: string): Promise<void> {
    await db.delete(session_table).where(eq(session_table.userId, userId));
}

