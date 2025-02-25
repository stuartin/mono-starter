import { initGraphQLTada } from 'gql.tada';
import type { introspection } from './graphql-env.js';

export const graphql = initGraphQLTada<{
    introspection: introspection;
}>();

export type { FragmentOf, ResultOf, VariablesOf, TadaDocumentNode } from 'gql.tada';
export { readFragment } from 'gql.tada';