import Head from 'next/head';
import RaceRecorder from '../components/race-recorder/RaceRecorder';
import store from '../lib/store';
import { Provider } from 'react-redux';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import i18n from '../lib/localization';

export default function RaceRecorderPage() {   
  
  const router = useRouter();
  i18n.changeLanguage(router.locale);

  return (
    <>
      <Head>
        <title>Kilpailurekisteri - Ajat</title>
      </Head>

      <Header></Header>

      <main>
        <Provider store={store}>
          <RaceRecorder></RaceRecorder>
        </Provider>
      </main>
    </>
  )
}
