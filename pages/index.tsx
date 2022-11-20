import Head from 'next/head';
import RaceRecorder from '../components/race-recorder/race-recorder';
import store from '../lib/store';
import { Provider } from 'react-redux';
import Header from '../components/Header';

export default function RaceRecorderPage() {    
  return (
    <>
      <Head>
        <title>Kilpailurekisteri</title>
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
