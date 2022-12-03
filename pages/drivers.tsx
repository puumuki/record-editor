import Head from 'next/head';
import store from '../lib/store';
import { Provider } from 'react-redux';
import DriversEditor from '../components/driver-editor/DriversEditor';
import Header from '../components/Header';

export default function DriverEditorPage() {    
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
