
import { useEffect } from 'react';
import { unixTimeToLocalTime } from '../../lib/date-helper';
import TimeLeftField from '../time-left-field';
import {SessionEditorModal} from './session-editor-modal';

;

import { 
  changeTrack, 
  fetchTracksAndDrivers, 
  setRecordModal, 
  deleteSession,
  setTrackEditorModal,
  SessionEditorState
} from './editor-slice'
import { sortSessionByTime } from './helpers';
import TrackEditorModel from './track-editor-modal';
import { useAppDispatch } from './hooks';
import { useAppSelector } from './store';


export default function DriversEditor() {

  const state = useAppSelector( state => state.editor );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTracksAndDrivers());
  }, [dispatch]);
  
  return <>    
    <section className="race-recorder container">
      {state.drivers.map(driver => {
        return <div key={driver.id}>{driver.name}</div>
      })}  
    </section>

  </>
}

