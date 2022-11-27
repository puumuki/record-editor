import React, { useEffect } from 'react';

import { 
  createRecord,
  changeTrack, 
  fetchTracksDriversCars as fetchTracksDriversCars,   
  setCarId,   
  setDriverId,   
  setTime,   
  setTrackEditorModal,
  deleteRecord,
  setShowConfirmDialog,
  setRecordId,
  setModifyRecordId,
  updateRecord,
  updateHistoryState,
  updateStateFromHistory
} from './race-recorder-slice'

import TrackEditorModel from './track-editor-modal';
import { useSession } from 'next-auth/react';
import { Car, Driver, Record, Track } from '../../types/types';
import { useAppDispatch, useAppSelector } from './hooks';
import SecondParts from '../../lib/second-parts';
import ConfirmModal from '../confirm-modal';
import { batch } from 'react-redux';
import Spinner from '../Spinner/Spinner';
import { readHistoryState } from './history';
import { sortCarsAlphabetically, sortTrackAlphabetically } from '../../lib/helpers';
import WarningMessage from '../Warning';
import Score from '../Score';

interface createRowTypes {
  record_id?: number, 
  track_id?:number, 
  drivers:Driver[], 
  tracks:Track[], 
  cars: Car[],
  modify_record_id?: number,
  session:any
}

function createRecordRows({record_id, track_id, drivers, tracks, cars, modify_record_id, session}:createRowTypes) {
  
  const track = tracks.find( track => track.id === track_id );

  if( !track ) {
    return;
  }    

  return track.records.slice().sort((recordA, recorB) => {
    return recordA.time - recorB.time;
  }).map( (record, index) => {

    let rowStyleClass = record_id && record_id === record.id ? 'animate__animated animate__bounce' : '';
    rowStyleClass += modify_record_id === record.id ? ' beign-modified' : '';

    const driver = drivers.find( driver => driver.id === record.drivers_id );
    const car = cars.find( car => car.id === record.cars_id );
    return <tr key={`tr-record-${index}`} className={rowStyleClass}>
      <td>{new SecondParts(record.time).format}</td>
      <td>{driver?.name}</td>
      <td>{car?.name}</td>
      <td><Score score={car?.scores} /></td>
      {session && ( 
        <td className={`text-end`}>
          <button type="button" 
                    data-record-id={record.id}
                    className="btn btn-primary modify-record me-sm-2 mb-2 mb-sm-0" >Muokkaa</button>          
          <button type="button" 
                    data-record-id={record.id}
                    className="btn btn-primary delete-record" >Poista</button>
        </td>)}
    </tr>
  }) 
}

export default function RaceRecorder() {  

  const { data: session } = useSession();
  
  const state = useAppSelector( (state) => state.raceeditor );    
  const dispatch = useAppDispatch();

  //Clear car's id when a document is clicked outside of the table
  useEffect(() => {

    function onBodyClick(event:MouseEvent) {    
      const target = event.target as Element;
      
      //Click outside table cell
      if( !target.closest('.race-recorder ') ) {        
        batch(() => {
          dispatch(setTime(''));
          dispatch(setRecordId(undefined));
          dispatch(setModifyRecordId(undefined));
          dispatch(setDriverId(undefined));
        });
      }    
    }
  
    window.addEventListener( 'click', onBodyClick )

    return () => {    //Cleanup
      window.removeEventListener('click', onBodyClick);
    }
  });


  useEffect(() => {
    dispatch(fetchTracksDriversCars());  
    
    //Window is not defined when server renders the component.. Next.js :3
    if(typeof window !== 'undefined') {  
      dispatch(updateStateFromHistory(readHistoryState()));      
    }   
  }, [dispatch]);

  function onTrackChange(event:React.ChangeEvent) {  
    const target = event.target as HTMLSelectElement;
    
    batch(() => {
      const trackId = parseInt(target.value)
      dispatch(changeTrack(trackId));  
      dispatch(updateHistoryState({
        ...state.historyState,
        track_id: trackId
      }))
    });    
  }

  function onCarChanges(event:React.ChangeEvent) {
    const target = event.target as HTMLSelectElement;
 
    batch(() => {
      const carId = parseInt(target.value)
      dispatch(setCarId(carId));   
      dispatch(updateHistoryState({
        ...state.historyState,
        cars_id: carId
      }))
    });    
  }

  function onClickModifyRecord(event:React.MouseEvent) {   
    
    const secondPars = new SecondParts( state.time );

    const record:Record = {
      id: null,
      time: secondPars.rawvalue,
      cars_id: state.car_id,
      drivers_id: state.driver_id,
      tracks_id: state.track_id
    }

    batch(() => {
      dispatch(updateHistoryState({
        modify_record_id: undefined,
        cars_id: undefined,
        drivers_id: undefined,
        time: undefined,
        track_id: undefined 
      }))

      if( state.modify_record_id ) {
        dispatch(updateRecord({ ...record, id: state.modify_record_id }));
      } else {        
        dispatch(createRecord(record));
      }
    });
  }

  function onTableClick(event:React.MouseEvent) {
    const target = event.target as HTMLButtonElement;       
    if( target.dataset.recordId ) {
      const recordId = parseInt(target.dataset.recordId);
      const record = state.tracks.find(track => track.id === state.track_id)?.
                            records.find( record => record.id === recordId);      

      if( record && record.drivers_id) {
        if( target.classList.contains('delete-record') ) {

          dispatch(setRecordId(recordId));
          dispatch(setShowConfirmDialog(true));      
        }
        
        if( target.classList.contains('modify-record') ) {
          const recordId = parseInt(target.dataset.recordId);
          
          batch(() => {            
            const time = new SecondParts(record.time).toString();
            dispatch(setModifyRecordId(recordId));
            dispatch(setTime(time));
            dispatch(setDriverId(record.drivers_id ?? 0));
            dispatch(setCarId(record.cars_id ?? 0));            
            dispatch(updateHistoryState({
              ...state.historyState,
              modify_record_id: recordId,               
              time, 
              drivers_id: record.drivers_id ?? undefined, 
              cars_id: record.cars_id ?? undefined  
            }));
          });     
        }  
      }       
    }     
  }

  function onConfirmDelete() {
    const record = state.tracks.find( track => track.id === state.track_id )?.
                        records.find(record => record.id === state.record_id);

    if( record ) {      
      batch(() => {
        dispatch(setShowConfirmDialog(false));
        dispatch(deleteRecord(record));
      });      
    }
  }

  function updateTrack() {
    const track = state.tracks.find( track => track.id === state.track_id );
    if( track )  {
      dispatch(setTrackEditorModal({ showTrackEditorModal: true, trackEditorModalTrack: track }));   
    }    
  }  

  function createTrack() {    
    dispatch(setTrackEditorModal({ showTrackEditorModal: true, trackEditorModalTrack: null }));   
  }    

  function onClose() {
    dispatch(setShowConfirmDialog(false));    
  }

  function onTimeChanges(event:React.ChangeEvent) {
    try {
      const inputElement = event.target as HTMLInputElement;     
      batch(() => {
        dispatch(updateHistoryState({...state, time: inputElement.value}));
        dispatch(setTime(inputElement.value));
      });    
    } catch( error ) {
      console.log( error );
    }
  }

  function onDriverChanges(event:React.ChangeEvent) {
    const selectElement = event.target as HTMLSelectElement;
    batch(() => {
      const driverId = parseInt(selectElement.value);
      dispatch(updateHistoryState({...state, drivers_id: driverId }));
      dispatch(setDriverId( driverId ));                
    })    
  }
      
  return (
    <section className="race-recorder container">
            
      {state.drivers.length === 0 && (
        <WarningMessage title="Onglema havaittu" 
                        message="Tietoja kuskeista ei ole tällä hetkellä saatavissa, onko yhteys tietokantaan poikki vai eikö tietokannasta löydy tietoa?" />
      )}


      { state.showTrackEditorModal && (
        <TrackEditorModel showTrackEditorModal={state.showTrackEditorModal}
                          trackEditorModalTrack={state.trackEditorModalTrack} />
      )}

      { state.showConfirmDialog && (
        <ConfirmModal title='Olet poistamassa aikaa.'
                      text="Haluatko varmasti poistaa merkinnän?"
                      confirmCallBack={onConfirmDelete} 
                      onCloseCallBack={onClose} ></ConfirmModal>
      )}
        
      <div className="row">
        <div className="col-lg-3 col-md-12">
          <label htmlFor="track-select">Rata</label>
          <select id="track-select" className="form-select" value={state.track_id} onChange={onTrackChange} aria-label="Valitse kenttä">
           {sortTrackAlphabetically(state.tracks).map( track => {
              return <option key={track.id} value={track.id ? track.id : undefined}>{track.name}</option>
            })}
          </select>               
        </div>

        {session && (
        <>
        
        <div className='col-lg-3 col-md-12 mt-3 mt-lg-0 d-flex align-items-end'>          
          <button type='button' className='btn btn-primary' onClick={updateTrack}>Muokkaa rataa</button>
          <button type='button' className='btn btn-primary ms-2' onClick={createTrack}>Lisää rata</button>        
        </div>


        <div className='col-md-12 col-lg-6 mt-3 mt-lg-0 d-flex justify-content-lg-end'>

          <div className='form-group ms-3'>
            <label htmlFor="driver">Pelaaja</label>
            <select id="driver" className='form-control' 
              value={state.driver_id ? state.driver_id : ''}
              onChange={onDriverChanges}>
              <option value="">Ei valintaa</option>
              {state.drivers.map( driver => {
                return <option value={driver.id ?? undefined} key={driver.id}>{driver.name}</option>
              })}
            </select>
          </div>

          <div className='form-group ms-3'>
            <label htmlFor="car">Ajoneuvo</label>
            
            <select id="car" 
                    onChange={onCarChanges}
                    value={state.car_id}
                    className='form-control' 
                    disabled={!state.cars.some( car => car.drivers_id === state.driver_id )}>
              <option value="">Ei valintaa</option>                        
              {sortCarsAlphabetically(state.cars.filter( car => car.drivers_id === state.driver_id )). map( car => {
                return <option value={car.id ?? undefined} key={car.id}>{car.name}</option>
              })}
            </select>
          </div>    

          <div className='form-group ms-3'>
            <label htmlFor="time">Aika</label>
            <input id="time" type="text" className='form-control' value={state.time || ''} onChange={onTimeChanges}></input>
          </div>

          <div className='form-group ms-3 d-flex align-items-end me-2'>            
            <button type="button" 
                    className='btn btn-primary' 
                    disabled={!(state.driver_id && state.car_id && SecondParts.validate(state.time))} 
                    onClick={onClickModifyRecord}>{state.modify_record_id ? 'Muokkaa' : 'Lisää'}</button>
          </div>
        </div>  

        </>      
        )}

        <div className='col-12'>

          <table className='table' onClick={onTableClick}>
            <thead>
              <tr>
                <td>Aika</td>
                <td>Kuski</td>
                <td>Auto</td>
                <td colSpan={2}>Auton pisteet</td>
              </tr>
            </thead>

            <tbody>              
              {createRecordRows({ 
                record_id: state.record_id,
                track_id: state.track_id, 
                drivers: state.drivers, 
                tracks: state.tracks,
                cars: state.cars,
                modify_record_id: state.modify_record_id,
                session
              })}              
            </tbody>

          </table>
        </div>



      </div>

      {state.status === 'loading' && (
        <Spinner></Spinner>
      )}
  
    </section> 
  )

}