import { graphql } from "@mono/shared/graphql";
import { request } from "./request";
import { expect } from "vitest";
import { omitEmpty } from "#lib/utils/omit-empty.js";

export type TestUser = {
    id: string
    name: string
    email: string
    password: string
}

export async function newUser(name: string, email: string) {

    const password = generateValidPassword()

    const q = graphql(`
        mutation Register($input: MutationRegisterInput!) {
            register(
                input: $input
            ) {
                id
                name
            }
        }    
    `)

    const req = await request(q, { input: { email, name, password } })
    const json = await req.json()

    expect(json.errors).toBeUndefined()
    expect(json.data.register).not.toBeNull()

    return {
        ...omitEmpty(json.data.register!),
        email,
        password
    }
}


function generateValidPassword(length: number = 12): string {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const special = "!@#$%^&*()-__+.";
    const digits = "0123456789";
    const allChars = lowercase + uppercase + special + digits;

    // Ensure at least one of each required character type
    let password = [
        lowercase[Math.floor(Math.random() * lowercase.length)],
        uppercase[Math.floor(Math.random() * uppercase.length)],
        special[Math.floor(Math.random() * special.length)],
        digits[Math.floor(Math.random() * digits.length)]
    ];

    // Fill the rest with random characters
    for (let i = password.length; i < length; i++) {
        password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Shuffle the password to randomize character positions
    return password.sort(() => Math.random() - 0.5).join('');
}