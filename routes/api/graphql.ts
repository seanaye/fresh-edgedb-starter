import { gqlServer } from "../../graphql/main.ts"

export const handler = (
  req: Request
  // _ctx: HandlerContext
): Promise<Response> => {
  return gqlServer.fetch(req)
};
