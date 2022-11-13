import React, { useEffect } from 'react';

import { 
  changeTrack, 
  fetchTracksDriversCars as fetchTracksDriversCars,   
  setTrackEditorModal
} from './editor-slice'

import TrackEditorModel from './track-editor-modal';
import { useSession } from 'next-auth/react';
import { Car, Driver, Track } from '../../lib/race-recorder/types';
import { useAppDispatch, useAppSelector } from './hooks';
import SecondParts from '../../lib/second-parts';

function createColumns() {
  return [{ text: 'Aika'}, {text: 'Kuski'}, {text: 'Auto'}];
}

function createRecordRows({track_id, drivers, tracks, cars}:{ track_id?:number, drivers:Driver[], tracks:Track[], cars: Car[]}, sessionObject:any) {
  
  const track = tracks.find( track => track.id === track_id );

  if( !track ) {
    return;
  }    

  return track.records.slice().sort((recordA, recorB) => {
    return recordA.time - recorB.time;
  }).map( (record, index) => {
    const driver = drivers.find( driver => driver.id === record.drivers_id );
    const car = cars.find( car => car.id === record.cars_id );
    return <tr key={`tr-record-${index}`}>
      <td>{new SecondParts(record.time).format}</td>
      <td>{driver?.name}</td>
      <td>{car?.name}</td>
    </tr>
  }) 
}

export default function RaceRecorder() {  

  const { data: session } = useSession();
  
  const state = useAppSelector( (state) => state.editor );    
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTracksDriversCars());    
  }, [dispatch]);

  function onTrackChange(event:React.ChangeEvent) {  
    const target = event.target as HTMLSelectElement;
    dispatch(changeTrack(parseInt(target.value)));
  }

  function onClickAddRecord(event:React.MouseEvent) {    

  }

  function onTableClick(event:React.MouseEvent) {

  }

  function onClickEditTrack(event: React.MouseEvent) {    
    dispatch(setTrackEditorModal({
      showTrackEditorModal: true,
      trackEditorModalTrack: state.tracks.find( track => track.id === state.track_id )
    })); 
  }

  function onClickAddTrack(event:React.MouseEvent) {
    dispatch(setTrackEditorModal({
      showTrackEditorModal: true,
      trackEditorModalTrack: { id: null, name: '', records: [] }
    })); 
  }

  

  return (
    <section className="race-recorder container">
            
      { state.showTrackEditorModal && (
        <TrackEditorModel showTrackEditorModal={state.showTrackEditorModal}
                          trackEditorModalTrack={state.tracks.find( track => track.id === state.track_id)} />
      )}
        
      <div className="row">
        <div className="col-3">
          <select className="form-select" defaultValue={state.track_id} onChange={onTrackChange} aria-label="Valitse kenttä">
           {state.tracks.map( track => {
              return <option key={track.id} value={track.id ? track.id : undefined}>{track.name}</option>
            })}
          </select>      
        </div>

        <div className='col-12'>

          <table className='table' onClick={onTableClick}>
            <thead>
              <tr>
                { createColumns().map( (column, index) => {
                  return <th key={`th-${index}`}>{column.text}</th>
                }) }                
              </tr>
            </thead>

            <tbody>              
              {createRecordRows({ 
                track_id: state.track_id, 
                drivers: state.drivers, 
                tracks: state.tracks,
                cars: state.cars 
              }, session)}              
            </tbody>

          </table>
        </div>

        {session && (
        <div className='col-12 d-flex justify-content-end'>
          <button className='btn btn-primary' onClick={onClickAddRecord}>Lisää sessio</button>
        </div>
        )}


      </div>
    
    </section> 
  )

}