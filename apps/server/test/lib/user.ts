import { graphql } from "@mono/shared/graphql";
import { request } from "./request";
import { omitEmpty } from "#lib/utils/omit-empty.js";

export const MutationRegister = graphql(`
    mutation Register($input: MutationRegisterInput!) {
        register(
            input: $input
        ) {
            id
            name
        }
    }    
`)

export async function newUser(name = genName(), email = genEmail()) {
    const password = genPassword()

    const res = await request(MutationRegister, { input: { email, name, password } })
    const json = await res.json()

    return {
        ...omitEmpty(json.data.register!),
        cookie: res.headers.get("set-cookie") ?? "",
        input: {
            email,
            password
        }
    }
}

export function genName() {
    return `test-user-${Date.now()}`
}

export function genEmail() {
    return `test-user-${Date.now()}@test.com`
}

export function genPassword(length: number = 12): string {
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