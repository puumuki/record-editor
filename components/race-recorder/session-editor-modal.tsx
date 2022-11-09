import SecondParts from "../../lib/second-parts";

import TextField from '../text-field';
import DateTimeField from '../date-time';
import DriverField from './driver-field';

import { RecordValidity, sessionEditorRecordValidity, setSessionEditorSession, showRecordModal, updateSession } from './editor-slice';
import { useAppDispatch } from './hooks';
import { Driver, Session, Track } from "../../lib/race-recorder/types";

/**
 * Filter drivers for a <DriverField> element
 * @param {Session} session state object
 * @param {Driver[]} drivers driver objects
 * @returns {Driver[]}
 */
function filterDrivers(session:Session, drivers:Driver[]) {  
  if( session.records && session.records.length > 0 ) {  
    return drivers.filter( driver => !session.records.some( (record) => record.drivers_id === driver.id ) )
  } else {
    return drivers;
  }
}

interface SessionEditorModalParameters {
  sessionEditorOpen:boolean,
  sessionEditorTrack: Track,
  sessionEditorSession: Session,
  sessionEditorDriverEditField: boolean,
  sessionEditorRecordValidity: RecordValidity[] 
  drivers: Driver[]  
}

export function SessionEditorModal({
  sessionEditorOpen, 
  sessionEditorTrack:track, 
  sessionEditorSession: session, 
  sessionEditorDriverEditField,
  sessionEditorRecordValidity: recordValidity,
  drivers}:SessionEditorModalParameters) {

  const dispatch = useAppDispatch();

  function onClose() {
    dispatch(showRecordModal(false));    
  }
        
  function onSaveClicked() {                
    dispatch(updateSession({ trackId: track.id,  session: session }));
    dispatch(showRecordModal(false));    
  }

  function onTimeChanges( unixtime:number ) {                
    dispatch(setSessionEditorSession({
      ...session,
      time: unixtime
    }));
  }

  function onRecordTimeChanges( event:React.ChangeEvent<HTMLInputElement> ) {           

    const target = event.target as HTMLInputElement;

    const isValid = SecondParts.validate( target.value );    
    const [s, sessionId, driverId] = target.id.split('-');
    const record = session.records.find( record => record.drivers_id === parseInt( driverId ) );          

    const validity:RecordValidity[] = session.records.map( record2 => ({ 
      isValid: record2.id === record?.id ? isValid : null,
      record: record2 
    }));

    dispatch(sessionEditorRecordValidity( validity ));    

    if( isValid ) {
      const parts = new SecondParts( target?.value )

      dispatch(setSessionEditorSession({
        ...session,
        records: session.records.map( record => {            
          if( record.drivers_id === parseInt( driverId ) ) {              
            return { ...record, time: parts.rawvalue };
          }
          return record;
        })          
      }));  
    } 
  }  

  const orderedDrivers = [...drivers].sort( driver => driver.order );

  return (
    <div className={`modal fade ${sessionEditorOpen ? 'show' : ''}`} tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            
            <h5 className="modal-title">{track.name ?? '---' }</h5>

            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <form>
              <div className="row g-3">        
              
                <div className='col-12'>
                  <DateTimeField id="session-time"
                            name="session-time"
                            label=""                                                           
                            value={session.time}                            
                            onChange={onTimeChanges}></DateTimeField>                                
                </div>

                {orderedDrivers.filter(driver => {
                  return session.records.some(record => record.drivers_id === driver.id);
                }).map( (driver,i) => {
                  const record = session.records.find( record => record.drivers_id === driver.id );
                  
                  const secondParts = new SecondParts( record?.time );                
                  
                  const validity = recordValidity.find( validity => validity.record.id === record?.id ) ?? null;                  
                  const success = validity?.isValid;
                  const error = validity?.isValid === false;   
                  
                  return (
                    <div key={record?.id} className='col-12'>
                      <div  className='form-group'>
                        <TextField id={`session-${session.id}-${driver.id}-${i}`} 
                                  name="record-time"
                                  onChange={onRecordTimeChanges}
                                  label={driver.name}                               
                                  value={secondParts.format}
                                  success={Boolean(success)}
                                  error={error}></TextField>
                      </div>
                    </div>
                  ) 
                })}

                <div className='col-12 mt-3'>
                  {<DriverField edit={sessionEditorDriverEditField} drivers={filterDrivers(session, drivers)}></DriverField>}
                </div>

              </div>              
            </form>
          </div>


          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={onSaveClicked}>Tallenna</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Peruuta</button>
          </div>
        </div>

      </div>
    </div>
  );
}