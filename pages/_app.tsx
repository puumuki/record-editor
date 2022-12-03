import 'animate.css';
import '../styles/bootsrap-icons/bootstrap-icons.scss';
import '../styles/globals.scss';
import '../styles/header.scss';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import i18n from '../lib/localization';


export default function App({ Component, pageProps: { session, ...pageProps} }: AppProps) {
  return <SessionProvider session={session}><Component {...pageProps} /></SessionProvider>
}
 