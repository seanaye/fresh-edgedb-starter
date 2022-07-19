/* eslint-disable */
import * as graphql from './graphql.ts';
import { TypedDocumentNode as DocumentNode } from 'https://esm.sh/@graphql-typed-document-node/core';

const documents = {
    "\nquery users {\n  users {\n    id\n    name\n    age\n  }\n}\n": graphql.UsersDocument,
};

export function gql(source: "\nquery users {\n  users {\n    id\n    name\n    age\n  }\n}\n"): (typeof documents)["\nquery users {\n  users {\n    id\n    name\n    age\n  }\n}\n"];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;