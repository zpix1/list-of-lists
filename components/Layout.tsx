import { AppShell, Navbar, Header, Container } from '@mantine/core'
import Head from 'next/head'
import { AppHeader } from 'components/AppHeader'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>List Of Lists</title>
      </Head>
      <style jsx global>{`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Helvetica Neue', Arial, Noto Sans, sans-serif, 'Apple Color Emoji',
            'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        }
      `}</style>
      <AppShell
        padding="md"
        // navbar={<Navbar width={{ base: 300 }} height={500} padding="xs">{/* Navbar content */}</Navbar>}
        header={<AppHeader />}
      >
        <Container>
          {children}
        </Container>
      </AppShell>
    </>
  )
}
