
import { useEffect } from 'react';

import { 
  fetchTracksDriversCars, 
} from './editor-slice'

import { useAppDispatch } from './hooks';
import { useAppSelector } from './store';

export default function DriversEditor() {

  const state = useAppSelector( state => state.editor );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTracksDriversCars());
  }, [dispatch]);
  
  return <>    
    <section className="race-recorder container">
      {state.drivers.map(driver => {
        return <div key={driver.id}>{driver.name}</div>
      })}  
    </section>

  </>
}

