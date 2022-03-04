import type { User } from './user'

import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt';

export default withIronSessionApiRoute(loginRoute, sessionOptions)

const prisma = new PrismaClient()

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = await req.body

  try {
    const user = await prisma.user.findUnique({
      where: { email: email }
    })

    if (!user) {
      throw new Error('User with given email not found')
    }

    const passwordResult = await bcrypt.compare(password, user.passwordHash)

    if (!passwordResult) {
      throw new Error('Password is not correct')
    }

    req.session.user = {
      isLoggedIn: true,
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }

    await req.session.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}
