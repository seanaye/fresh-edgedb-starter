import { createServer } from "https://esm.sh/@graphql-yoga/common@2.12.1";
import { schema } from "./schema.ts";

// required to make typescript happy with graphql-yoga
declare global {
  type WindowOrWorkerGlobalScope = typeof window;
}

export const endpoint = "http://localhost:8000/api/graphql";
export const gqlServer = createServer({
  schema,
  endpoint,
});
