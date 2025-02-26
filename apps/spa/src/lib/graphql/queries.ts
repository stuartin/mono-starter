import { graphql } from "@mono/shared/graphql";

export const QueryMe = graphql(`
    query Me {
        me {
            id
            name
        }
    }
`)
