import type { User } from './user'

import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import * as bcrypt from 'bcrypt'

export default withIronSessionApiRoute(registerRoute, sessionOptions)

const prisma = new PrismaClient()

const saltOrRounds = 10
const password = process.env.SECRET_PASSWORD_PEPPER

async function registerRoute(req: NextApiRequest, res: NextApiResponse) {
  const { firstName, lastName, email, password } = await req.body

  try {
    if (firstName.length < 2  ||
      lastName.length < 2     ||
      email.length < 2        ||
      !email.includes('@')    ||
      password.length < 3
    ) {
      throw new Error('Invalid params')
    }

    if (await prisma.user.findUnique({
      where: {
        email: email
      }
    })) {
      throw new Error('User with given email already exists')
    }

    const passwordHash = await bcrypt.hash(password, saltOrRounds)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash
      }
    })

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
