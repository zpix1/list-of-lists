import { withIronSessionSsr } from "iron-session/next";
import { User, zeroUser } from "pages/api/user";
import { sessionOptions } from "./session";

export default function withIronSessionSsrAuth(handler: Parameters<typeof withIronSessionSsr>[0]) {
  return withIronSessionSsr(async function (context) {
    const user = context.req.session.user
  
    if (user === undefined) {
      context.res.setHeader('location', '/login')
      context.res.statusCode = 302
      context.res.end()
      return {
        props: {
          user: {
            ...zeroUser
          },
        },
      }
    }
    return handler(context);
  }, sessionOptions)
}