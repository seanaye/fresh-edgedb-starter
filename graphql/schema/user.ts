import { BuilderFn, DB } from "../types.ts";
import { client, e, User } from "../../utils/edgedb.ts";

const query = e.params({ limit: e.int64 }, (param) =>
  e.select(e.User, () => ({ limit: param.limit, ...e.User["*"] }))
);

export const withUser: BuilderFn = (builder) => {
  const UserType = builder.objectRef<DB<User>>("User").implement({
    fields: (t) => ({
      name: t.exposeString("name", {}),
      age: t.exposeInt("age", {}),
      id: t.exposeID("id", {}),
    }),
  });

  builder.queryType({
    fields: (t) => ({
      users: t.field({
        type: [UserType],
        args: {
          limit: t.arg.int({
            required: false,
          }),
        },
        resolve: (_, args) => query.run(client, { limit: args.limit ?? 10 }),
      }),
    }),
  });

  return builder;
};
