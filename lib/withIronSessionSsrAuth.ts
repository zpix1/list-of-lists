import { withIronSessionSsr } from "iron-session/next";
import { User } from "pages/api/user";
import { sessionOptions } from "./session";

export default function withIronSessionSsrAuth(...params: Parameters<typeof withIronSessionSsr>) {
  return withIronSessionSsr(async function (context) {
    const user = context.req.session.user
  
    if (user === undefined) {
      context.res.setHeader('location', '/login')
      context.res.statusCode = 302
      context.res.end()
      return {
        props: {
          user: null,
        },
      }
    }
    return params[0](context);
  },
  sessionOptions)
}