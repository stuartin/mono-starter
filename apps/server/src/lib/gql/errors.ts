export type ErrorExtensions = (typeof ERR)[keyof typeof ERR]["extensions"];
export { GraphQLError } from 'graphql'

export const ERR = {
    NOT_FOUND: {
        extensions: {
            code: "NOT_FOUND",
        },
    },
    INVALID: {
        extensions: {
            code: "INVALID",
            http: { status: 400 }
        },
    },
    SERVER: {
        extensions: {
            code: "SERVER",
            http: { status: 500 },
        },
    },
    UNAUTHORIZED: {
        extensions: {
            code: "UNAUTHORIZED",
            http: { status: 401 },
        },
    },
} as const;
