import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { api } from '@/server/utils/api'
import { Session } from 'next-auth'
import { SessionProvider, signIn, useSession } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import * as React from 'react'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'

type AppPropsWithAuthAndLayout = AppProps<{ session: Session }> & {
  Component: NextPageWithAuthAndLayout
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuthAndLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {Component.auth ? (
          <Auth>{getLayout(<Component {...pageProps} />)}</Auth>
        ) : (
          getLayout(<Component {...pageProps} />)
        )}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
}

function Auth({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const isUser = !!session?.user
  React.useEffect(() => {
    if (status === 'loading') return // Do nothing while loading
    if (!isUser) signIn() // If not authenticated, force log in
  }, [isUser, status])

  if (isUser) {
    return <>{children}</>
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return null
}

export default api.withTRPC(MyApp)
