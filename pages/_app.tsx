import 'animate.css'
import '../styles/bootsrap-icons/bootstrap-icons.scss'
import '../styles/globals.scss'
import '../styles/header.scss'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps): React.ReactElement {
  return <SessionProvider session={session}><Component {...pageProps} /></SessionProvider>
}
