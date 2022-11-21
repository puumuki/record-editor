import Head from 'next/head';
import RaceRecorder from '../components/race-recorder/race-recorder';
import store from '../lib/store';
import { Provider } from 'react-redux';
import DriversEditor from '../components/driver-editor/drivers-editor';
import Header from '../components/Header';

export default function RaceRecorderPage() {    
  return (
    <>
      <Head>
        <title>Kilpailurekisteri - Kuskit</title>
      </Head>

        <Header></Header>
      <main>
        <Provider store={store}>
          <DriversEditor></DriversEditor>
        </Provider>
      </main>
    </>
  )
}
