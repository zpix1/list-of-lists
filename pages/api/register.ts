import type { User } from './user'

import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

export default withIronSessionApiRoute(registerRoute, sessionOptions)

async function registerRoute(req: NextApiRequest, res: NextApiResponse) {
  const { firstName, lastName, email, password } = await req.body

  try {
    const user = { isLoggedIn: true, email, firstName, lastName } as User
    req.session.user = user
    await req.session.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}
