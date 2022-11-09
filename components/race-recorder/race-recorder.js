

import { useState, useEffect } from 'react';
import { unixTimeToLocalTime } from '../../lib/date-helper';
import TimeLeftField from '../time-left-field';
import {SessionEditorModal} from './session-editor-modal';

import { useSelector, useDispatch } from 'react-redux';

import { 
  changeTrack, 
  fetchTracksAndDrivers, 
  showRecordModal, 
  setRecordModal, 
  updateTrackDrivers,
  updateSession, 
  deleteSession,
  setTrackEditorModal
} from './editor-slice'
import { sortSessionByTime } from './helpers';
import TrackInputField from './track-editor-modal';
import TrackEditorModel from './track-editor-modal';

function createColumns( drivers ) {

  const driverColumns = [...drivers].sort( driver => driver.order )
                               .map( driver => ({ text: `${driver.name}` }));

  return [{ text: 'Aika'}, ...driverColumns, { text:''}];
}

function createRecordRows({track_id, drivers, tracks}) {

  const track = tracks.find( track => track.id === track_id );

  if( !track ) {
    return;
  }

  const orderedDrivers = [...drivers].sort( driver => driver.order );

  const sessions = track.sessions.slice().sort(sortSessionByTime)
      
  return sessions.map( (session, index) => {

    return <tr key={`tr-session-${index}`}>
      <td data-session-id={session.id} key={`session-${index}`}>{unixTimeToLocalTime(session.time)}</td>

      {orderedDrivers.map( (driver, jindex) => {        
        const record = session.records.find( record => record.drivers_id === driver.id );
        return <td key={`session-${index}-${jindex}`}>
          <TimeLeftField seconds={record?.time}></TimeLeftField>
        </td>        
      })}

      <td key={`session-${index}-2`} className="text-end">
      <button className='btn btn-outline-secondary btn-delete-session' 
              data-track-id={track.id}
              data-session-id={session.id}>Poista</button>

        <button className='btn btn-outline-secondary btn-edit-session ms-3' 
                data-track-id={track.id}
                data-session-id={session.id}>Muokkaa</button>
      </td>
    </tr>
  })
}

export default function RaceRecorder() {  

  const state = useSelector( (state) => state.editor );  
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTracksAndDrivers());
  }, [dispatch]);

  function onTrackChange(event) {        
    dispatch(changeTrack(parseInt(event.target.value)));
  }

  function onClickAddSession(event) {    

    const track = state.tracks.find( track => track.id === state.track_id );

    dispatch(setRecordModal({
      sessionEditorOpen: true,      
      sessionEditorTrack: track,
      sessionEditorSession: null
    }));
  }

  function onTableClick(event) {
    if( event.target.tagName === 'BUTTON' && event.target.classList.contains('btn-delete-session') ) {      
      const track = state.tracks.find( track => track.id === parseInt( event.target.dataset.trackId ) );            
      const sessionId = parseInt( event.target.dataset.sessionId );
      const session = track.sessions.find( session => session.id === sessionId);           
      dispatch(deleteSession(session));    
    }
    if( event.target.tagName === 'BUTTON' && event.target.classList.contains('btn-edit-session') ) {              
      
      const track = state.tracks.find( track => track.id === parseInt( event.target.dataset.trackId ) );            
      const sessionId = parseInt( event.target.dataset.sessionId );
      const session = track.sessions.find( session => session.id === sessionId);
            
      dispatch(setRecordModal({
        sessionEditorOpen: true, 
        sessionEditorSession: session,        
        sessionEditorTrack: track
      }));
    }
  }

  function onClickEditTrack(event) {    
    dispatch(setTrackEditorModal({
      showTrackEditorModal: true,
      trackEditorModalTrack: state.tracks.find( track => track.id === state.track_id )
    })); 
  }

  function onClickAddTrack(event) {
    dispatch(setTrackEditorModal({
      showTrackEditorModal: true,
      trackEditorModalTrack: { id: null, name: '', sessions: [] }
    })); 
  }

  return (
    <section className="race-recorder container">
            
      { state.sessionEditorTrack && (
        <SessionEditorModal {...state }></SessionEditorModal>
      )}

      { state.showTrackEditorModal && (
        <TrackEditorModel {...state}></TrackEditorModel>
      )}
        
      <div className="row">
        <div className="col-3">
          <select className="form-select" defaultValue={state.track_id} onChange={onTrackChange} aria-label="Default select example">
           {state.tracks.map( track => {
              return <option key={track.id} value={track.id}>{track.name}</option>
            })}
          </select>      
        </div>

        <div className='col-8'>
          <button className="btn btn-primary me-3" onClick={onClickEditTrack.bind(this, state.track_id)}>Muokkaa</button>
          <button className="btn btn-primary" onClick={onClickAddTrack}>Lisää</button>
        </div>

        <div className='col-12'>

          <table className='table' onClick={onTableClick}>
            <thead>
              <tr>
                { createColumns(state.drivers).map( (column, index) => {
                  return <th key={`th-${index}`}>{column.text}</th>
                }) }                
              </tr>
            </thead>

            <tbody>              
              {createRecordRows(state)}              
            </tbody>

          </table>
        </div>

        <div className='col-12 d-flex justify-content-end'>
          <button className='btn btn-primary' onClick={onClickAddSession}>Lisää sessio</button>
        </div>

      </div>

      {state.state}
      

    </section> 
  )

}