import { gql as _gql } from "https://esm.sh/graphql-tag?no-dts";
import type { Gql } from "../gql/index.ts";
import type { TypedDocumentNode } from "https://esm.sh/@graphql-typed-document-node/core";
import { err, errAsync, ok, ResultAsync } from "https://esm.sh/neverthrow";
import { endpoint, gqlServer } from "../graphql/main.ts";

export const gql = _gql as Gql;

type GqlSuccess<TData = any> = {
  data: TData;
  errors?: Error[];
};

type GqlFailure = {
  errors?: Error[];
};

type GqlRes<T> = GqlSuccess<T> | GqlFailure;

export function gqlFetch<TData = any, TVariables = Record<string, any>>(
  operation: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
  headersInit?: HeadersInit
): ResultAsync<GqlSuccess<TData>, Error | Response | GqlFailure> {
  const headers = new Headers(headersInit ?? {})
  headers.append("Content-Type", "application/json")
  const req = new Request(endpoint, {
    method: "post",
    body: JSON.stringify({
      query: operation.loc?.source.body,
      variables,
    }),
    headers,
  });

  return ResultAsync.fromPromise(gqlServer.fetch(req), (e) => e as Error)
    .andThen((res) => {
      if (!res.ok) {
        return errAsync(res);
      }
      return ResultAsync.fromPromise<GqlSuccess<TData>, Error>(
        res.json(),
        () => new Error(`Failed to parse json body`)
      );
    })
    .andThen((js) => {
      if ("data" in js && js?.data) {
        return ok(js as GqlSuccess<TData>);
      }
      return err(js as GqlFailure);
    });
}
