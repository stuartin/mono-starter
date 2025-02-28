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

export const MutationLogin = graphql(`
    mutation Login($input: MutationLoginInput!) {
        login(
            input: $input
        ) {
            id
            name
        }
    }    
`)

export const MutationLogout = graphql(`
    mutation Logout {
        logout {
            result
        }
    }    
`)