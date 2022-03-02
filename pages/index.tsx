import Layout from 'components/Layout'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import useUser from 'lib/useUser'
import withIronSessionSsrAuth from 'lib/withIronSessionSsrAuth'
import { InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import { User } from './api/user'

export default function Home({user}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      Welcome to list of lists {JSON.stringify(user)}
    </Layout>
  )
}

export const getServerSideProps = withIronSessionSsrAuth(async function ({
  req,
  res,
}) {
  return {
    props: { user: req.session.user },
  }
},
sessionOptions)