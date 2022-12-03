import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

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
  updateStateFromHistory,
  fetchCars,
  selectTrackRecords
} from './race-recorder-slice'

import TrackEditorModel from './TrackEditorModal';
import { useSession } from 'next-auth/react';
import { Car, Driver, Record, Track } from '../../types/types';
import { useAppDispatch, useAppSelector } from './hooks';
import SecondParts from '../../lib/second-parts';
import ConfirmModal from '../ConfirmModal';
import { batch, useSelector } from 'react-redux';
import Spinner from '../Spinner/Spinner';
import { readHistoryState } from './history';
import { isAdmin, sortCarsAlphabetically, sortTrackAlphabetically } from '../../lib/helpers';
import WarningMessage from '../Warning';
import useInterval from '../../hooks/use-interval';
import CarOption from './CarOptionSpan';
import RaceRecorderTableFooter from './RaceRecorderTableFooter';
import RaceRecorderTableRows from './RaceRecorderTableRow';
import useWindowEventListener from '../../hooks/use-window-event-listener';

export default function RaceRecorder() {  
  
  const { data: session } = useSession();
  const {t, i18n} = useTranslation();
  
  const state = useAppSelector( (state) => state.raceeditor );    
  const dispatch = useAppDispatch();
  
  //Peridiocally update cars from the database
  useInterval({ interval: 5000, callback: () => {
    dispatch(fetchCars());
  }});

  useWindowEventListener('click', (event) => {
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
        dispatch(updateHistoryState({...state.historyState, time: inputElement.value}));
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
      dispatch(updateHistoryState({...state.historyState, drivers_id: driverId }));
      dispatch(setDriverId( driverId ));                
    })    
  }  

  const records = useSelector( selectTrackRecords );
      
  return (
    <section className="race-recorder container">
            
      {state.drivers.length === 0 && (
        <WarningMessage title={t('racerecorder.database.connection.error.title')} 
                        message={t('racerecorder.database.connection.error.description')}></WarningMessage>
      )}


      { state.showTrackEditorModal && (
        <TrackEditorModel showTrackEditorModal={state.showTrackEditorModal}
                          trackEditorModalTrack={state.trackEditorModalTrack} />
      )}

      { state.showConfirmDialog && (
        <ConfirmModal title={t('racerecorder.confirmdialog.deletetime.title')}
                      text={t('racerecorder.confirmdialog.deletetime.description')}
                      confirmCallBack={onConfirmDelete} 
                      onCloseCallBack={onClose} ></ConfirmModal>
      )}
        
      <div className="row">
        <div className="col-lg-3 col-md-12">
          <label htmlFor="track-select">{t("racerecorder.track")}</label>
          <select id="track-select" 
                  className="form-select" 
                  value={state.track_id} onChange={onTrackChange} 
                  aria-label={t('racerecorder.choosetrack') ?? ''}>
           {sortTrackAlphabetically(state.tracks).map( track => {
              return <option key={track.id} value={track.id ? track.id : undefined}>{track.name}</option>
            })}
          </select>               
        </div>

        {isAdmin(session) && (
        <>
        
        <div className='col-lg-3 col-md-12 mt-3 mt-lg-0 d-flex align-items-end'>          
          <button type='button' className='btn btn-primary' onClick={updateTrack}>{t('racerecorder.modifytrackbutton')}</button>
          <button type='button' className='btn btn-primary ms-2' onClick={createTrack}>{t('racerecorder.createtrackbutton')}</button>        
        </div>


        <div className='col-md-12 col-lg-6 mt-3 mt-lg-0 d-flex justify-content-lg-end'>

          <div className='form-group ms-3'>
            <label htmlFor="driver">{t("racerecorder.driver")}</label>
            <select id="driver" className='form-control' 
              value={state.driver_id ? state.driver_id : ''}
              onChange={onDriverChanges}>
              <option value="">{t('racerecorder.emptyoption')}</option>
              {state.drivers.map( driver => {
                return <option value={driver.id ?? undefined} key={driver.id}>{driver.name}</option>
              })}
            </select>
          </div>

          <div className='form-group ms-3'>
            <label htmlFor="car">{t("racerecorder.vehicle")}</label>
            
            <select id="car" 
                    onChange={onCarChanges}
                    value={state.car_id}
                    className='form-control' 
                    disabled={!state.cars.some( car => car.drivers_id === state.driver_id )}>
              <option value="">{t('racerecorder.emptyoption')}</option>                        
              {sortCarsAlphabetically(state.cars.filter( car => car.drivers_id === state.driver_id )). map( car => {
                return <option value={car.id ?? undefined} key={car.id}><CarOption car={car}></CarOption></option>
              })}
            </select>
          </div>    

          <div className='form-group ms-3'>
            <label htmlFor="time">{t("racerecorder.time")}</label>
            <input id="time" type="text" className='form-control' value={state.time || ''} onChange={onTimeChanges}></input>
          </div>

          <div className='form-group ms-3 d-flex align-items-end me-2'>            
            <button type="button" 
                    className='btn btn-primary' 
                    disabled={!(state.driver_id && state.car_id && SecondParts.validate(state.time))} 
                    onClick={onClickModifyRecord}>{state.modify_record_id ? t('racerecorder.modify') : t('racerecorder.add') }</button>
          </div>
        </div>  

        </>      
        )}

        <div className='col-12'>

          <table className='table' onClick={onTableClick}>
            <thead>
              <tr>
                <th>{t('racerecorder.table.time')}</th>
                <th>{t('racerecorder.table.driver')}</th>
                <th>{t('racerecorder.table.vehicle')}</th>
                <th colSpan={2}>{t('racerecorder.table.scores')}</th>
              </tr>
            </thead>

            <tbody>              
              <RaceRecorderTableRows 
                record_id={state.record_id}
                track_id={state.track_id}
                drivers={state.drivers}
                tracks={state.tracks}
                cars={state.cars}
                records={records}
                modify_record_id={state.modify_record_id}            
                ></RaceRecorderTableRows>
            </tbody>

            <RaceRecorderTableFooter records={records}></RaceRecorderTableFooter>

          </table>
        </div>
      </div>

      {state.status === 'loading' && (
        <Spinner></Spinner>
      )}
  
    </section> 
  )

}