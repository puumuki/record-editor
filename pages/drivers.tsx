import Head from 'next/head';
import RaceRecorder from '../components/race-recorder/race-recorder';
import store from '../components/race-recorder/store';
import { Provider } from 'react-redux';
import DriversEditor from '../components/race-recorder/drivers-editor';
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
          <DriversEditor></DriversEditor>
        </Provider>
      </main>
    </>
  )
}
