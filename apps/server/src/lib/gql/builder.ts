import type { Context } from "#lib/yoga";

import SchemaBuilder from "@pothos/core";
import DrizzlePlugin from "@pothos/plugin-drizzle";
import PothosScopeAuthPlugin from "@pothos/plugin-scope-auth";
import ZodValidationPlugin from "@pothos/plugin-zod";
import WithInputPlugin from '@pothos/plugin-with-input';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';

import * as schema from "#lib/db/schema";
import { GraphQLError } from "graphql";
import { DateTimeResolver } from "graphql-scalars";

import { ERR } from "./errors";
import { drizzle } from "#lib/db";
import { ValidAuthContext } from "#features/auth/context";

interface Root<T> {
    Context: T;
    DefaultInputFieldRequiredness: true;
    DrizzleSchema: typeof schema;
    AuthScopes: {
        user: boolean;
    };
    AuthContexts: {
        user: T & ValidAuthContext;
    };
    Scalars: {
        DateTime: {
            Output: Date;
            Input: Date;
        };
    };
}

export const builder = new SchemaBuilder<Root<Context>>({
    defaultInputFieldRequiredness: true,
    withInput: {
        argOptions: {
            required: true,
        },
    },
    plugins: [PothosScopeAuthPlugin, WithInputPlugin, SimpleObjectsPlugin, ZodValidationPlugin, DrizzlePlugin],
    drizzle: {
        client: ctx => drizzle(ctx.DB),
        schema,
    },
    scopeAuth: {
        authScopes: ctx => ({
            user: !!ctx.user,
        }),
        unauthorizedError: (_parent, _context, _info, result) => new GraphQLError(result.message, ERR.UNAUTHORIZED),
    },
    zod: {
        validationError: (zodError) => {
            const details = {
                extensions: {
                    code: ERR.INVALID.extensions.code,
                    http: ERR.INVALID.extensions.http,
                    errors: zodError.errors.map(err => ({
                        path: err.path,
                        message: err.message,
                    })),
                },

            };
            return new GraphQLError("Validation error", details);
        },
    },
});

builder.queryType();
builder.mutationType();

builder.addScalarType("DateTime", DateTimeResolver);
