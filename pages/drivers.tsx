import Head from 'next/head';
import RaceRecorder from '../components/race-recorder/race-recorder';
import store from '../components/race-recorder/store';
import { Provider } from 'react-redux';
import DriversEditor from '../components/race-recorder/drivers-editor';

export default function RaceRecorderPage() {    
  return (
    <div>
      <Head>
        <title>Kilpailurekisteri</title>
      </Head>

      <main>
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <h1 className='mb-3'>Kuljettavat</h1>
            </div>
          </div>
        </div>

        <Provider store={store}>
          <DriversEditor></DriversEditor>
        </Provider>
      </main>
    </div>
  )
}
