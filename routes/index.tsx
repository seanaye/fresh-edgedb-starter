/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Handlers, PageProps } from "$fresh/server.ts";
import CounterInput from "../islands/CounterInput.tsx";
import { z } from "https://deno.land/x/zod/mod.ts";
import { $infer, client, e } from "../utils/edgedb.ts";
import { gql, gqlFetch } from "../utils/gql.ts"


const get = e.params(
  {
    limit: e.int16,
  },
  (params) => e.select(e.User, () => ({ limit: params.limit, ...e.User["*"] }))
);
type Data = $infer<typeof get>;

const q = gql(`
query users {
  users {
    id
    name
    age
  }
}
`)


const form = z.object({
  name: z.string().min(1),
  age: z.preprocess((v) => parseInt(v as string), z.number().min(0)),
});



export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const res = await gqlFetch(q)
    if (!res.isOk()) {
      console.log(res.error)
      return new Response("Internal server error", { status: 500 })
    }
    
    return ctx.render(res.value.data.users);
  },
  async POST(req) {
    const data = await req.formData();
    const d = form.safeParse({
      name: data.get("name"),
      age: data.get("age"),
    });
    if (!d.success) {
      return new Response(d.error.toString(), { status: 400 });
    }
    await e.insert(e.User, d.data).run(client);
    return new Response(null, {
      status: 303,
      headers: {
        Location: req.url,
      },
    });
  },
};

export default function Home({ data }: PageProps<Data>) {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>
      <img
        src="/logo.svg"
        height="100px"
        alt="the fresh logo: a sliced lemon dripping with juice"
      />
      <p class={tw`my-6`}>
        <form method="post">
          <input
            type="text"
            placeholder="name"
            name="name"
            class={tw`border rouded border-blue-500 my-2`}
          />
          <CounterInput start={25} name="age" />
          <button type="submit" class={tw`bg-blue-400 hover:bg-blue-300 rounded-xl p-2 shadow text-gray-800`}>Submit</button>
        </form>
      </p>
      <div class={tw`flex flex-col divide-y gap-2 mt-6`}>
        {data.map((u) => (
          <div class={tw`flex flex-row justify-between`}>
            <div>{u.name}</div>
            <div>{u.age}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
