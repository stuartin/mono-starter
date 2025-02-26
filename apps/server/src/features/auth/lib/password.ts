import { argon2Hash, argon2Verify } from "./hashing/argon2";
import { Context } from "#lib/yoga";

export async function hashPassword(password: string, ctx: Context): Promise<string> {
    return await argon2Hash(password, ctx);
}

export async function verifyPasswordHash(hash: string, password: string, ctx: Context): Promise<boolean> {
    return await argon2Verify(password, hash, ctx)
}