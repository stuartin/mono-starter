import { graphql } from "@mono/shared/graphql";

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