import { walk } from "https://deno.land/std/fs/walk.ts";

async function run() {
  const thisDir = new URL("./", import.meta.url).pathname;
  Deno.chdir(thisDir);
  const proc = Deno.run({
    cmd: ["pnpm", "codegen"],
  });

  await proc.status();
  // replace imports
  const toWalk = new URL("../gql", import.meta.url).pathname;
  for await (const entry of walk(toWalk)) {
    if (!entry.isFile) continue;
    if (entry.path.includes("index.ts")) {
      await Deno.writeTextFile(
        entry.path,
        `
import * as mod from "./gql.ts"
export type Gql = typeof mod.gql
`
      );
      continue;
    }
    const contents = await Deno.readTextFile(entry.path);
    const next = contents
      .replace(
        /from '@graphql-typed-document-node\/core'/g,
        `from 'https://esm.sh/@graphql-typed-document-node/core'`
      )
      .replace(/from '.\/graphql.js'/, `from './graphql.ts'`)
      .replace(/import\('\.\/graphql'\)/g, `import('./graphql.ts')`)
      .replace(
        /from "([\.\/]+)(.+)"/g,
        (_match, group1: string, group2: string) => {
          const end = group2.includes(".ts") ? "" : ".ts";
          const output = `from "${group1}${group2}${end}"`;
          return output;
        }
      );
    await Deno.writeTextFile(entry.path, next);
  }
}

if (import.meta.main) {
  await run();
  Deno.exit();
}
