import type { ErrorExtensions } from "#lib/gql/errors";
import { print } from "graphql";
import { TadaDocumentNode, VariablesOf, ResultOf } from "@mono/shared/graphql"
import { createExecutionContext, env, waitOnExecutionContext } from "cloudflare:test";
import worker from "../../src";

export async function request<T extends TadaDocumentNode<any, any>>(query: T, variables?: VariablesOf<T>) {
    const ctx = createExecutionContext();

    const req = new Request("http://127.0.0.1:8787/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: print(query),
            variables,
        }),
    });
    // @ts-expect-error env type uses TestContext
    const res = await worker.fetch(req, env, ctx);

    await waitOnExecutionContext(ctx);

    return {
        ...res,
        json: async () => res.json<GraphQlResponse<ResultOf<T>>>(),
    };
}

export interface GraphQlResponse<T> {
    data: T;
    errors?: Array<{ message: string; locations: string[]; extensions: ErrorExtensions }>;
}