import { List, Prisma, PrismaClient } from '@prisma/client'
import Layout from 'components/Layout'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import useUser from 'lib/useUser'
import withIronSessionSsrAuth from 'lib/withIronSessionSsrAuth'
import { InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import { User } from './api/user'

export const getServerSideProps = withIronSessionSsrAuth(async function ({
  req,
  res,
}) {
  const prisma = new PrismaClient();
  const { ownedLists, accessLists } = await prisma.user.findUnique({
    where: {
      id: req.session.user?.id
    },
    include: {
      ownedLists: true,
      accessLists: true
    }
  });

  return {
    props: {
      user: req.session.user,
      ownedLists,
      accessLists
    },
  }
})

export default function Home({ user, accessLists, ownedLists }: {
  user: User,
  accessLists: List[],
  ownedLists: List[]
}) {
  return (
    <Layout>
      Shared Lists:
      <ul>
        {ownedLists.map(list => <li>{list.name}</li>)}
      </ul>
      Shared Lists:
      <ul>
        {accessLists.map(list => <li>{list.name}</li>)}
      </ul>
    </Layout>
  )
}