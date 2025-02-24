export type ErrorExtensions = (typeof ERR)[keyof typeof ERR]["extensions"];

export const ERR = {
    NOT_FOUND: {
        extensions: {
            code: "NOT_FOUND",
        },
    },
    INVALID: {
        extensions: {
            code: "INVALID",
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
