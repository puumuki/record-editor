import Head from 'next/head';
import RaceRecorder from '../components/race-recorder/RaceRecorder';
import store from '../lib/store';
import { Provider } from 'react-redux';
import Header from '../components/Header';

export default function RaceRecorderPage() {    
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
