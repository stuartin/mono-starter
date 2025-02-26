import { schema } from "#lib/gql/schema";
import { printSchema } from "graphql";
import { describe, expect, it } from "vitest";

describe("schema", () => {
    it("matches the expected schema", () => {
        expect(printSchema(schema)).toMatchSnapshot();
    });
});
