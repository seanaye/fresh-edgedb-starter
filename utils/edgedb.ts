import { createClient } from "https://raw.githubusercontent.com/seanaye/edgedb-js/dist/deno/mod.ts"
import _e from "../dbschema/edgeql-js/index.ts"
export type { $infer } from "../dbschema/edgeql-js/index.ts";

export const client = createClient()
export const e = _e


