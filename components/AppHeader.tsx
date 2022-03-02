import Link from 'next/link'
import { Header, Title, ActionIcon, Text } from '@mantine/core'

import useUser from 'lib/useUser'
import { useRouter } from 'next/router'
import Image from 'next/image'
import fetchJson from 'lib/fetchJson'
import { Url } from './Url'

export const AppHeader = () => {
  const { user, mutateUser } = useUser()
  const router = useRouter()

  return (
    <Header height={60} padding="lg">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 50, justifyContent: 'space-between' }}>
        <Title order={2}>List Of Lists</Title>
        <div style={{ display: 'flex', justifyItems:'flex-start', flexGrow: 1, gap: 20 }}>
          {user?.isLoggedIn && <>
            <Link href="/">
              <Url>
                My lists
              </Url>
            </Link>
          </>}
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {user?.isLoggedIn && <>
            <Url
              href="/api/logout"
              onClick={async (e) => {
                e.preventDefault()
                mutateUser(
                  await fetchJson('/api/logout', { method: 'POST' }),
                  false
                )
                router.push('/login')
              }}
            >
              Logout
            </Url>
          </>}
        </div>
      </div>
    </Header>
  )
}
