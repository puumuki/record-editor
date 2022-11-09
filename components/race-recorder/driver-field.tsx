import SelectField from "../select-field";
import { Driver } from "../../lib/race-recorder/types";
import { showDriverEditField, setDriverEditFieldDriver, moveDriverToSessionEditor } from './editor-slice';
import { useDispatch } from 'react-redux';

/**
 * Format Driver object for use in a select dropdown.
 * @param driver 
 * @returns formatted driver data
 */
function formatDriverOption( driver:Driver ) {
  return {
    value: driver.id,
    text: driver.name
  }
}

export default function DriverField({edit, drivers}) {
 
  const dispatch = useDispatch();

  function addDriver() {
    dispatch(moveDriverToSessionEditor());     
    dispatch(showDriverEditField(false));     
  }

  function onDriverSelectionChanges(event) {
    const drivers_id = parseInt( event.target.value );
    const driver = drivers.find( driver => driver.id === drivers_id );    
    dispatch(setDriverEditFieldDriver(driver));       
  }

  function onClick() {
    dispatch(setDriverEditFieldDriver(drivers[0]));  
    dispatch(showDriverEditField(true));
  }

  return (
    <div className="row">
    {edit && (
      <>
      <div className="col-8">
        <SelectField id="driver-name" 
                    name="record-time"                  
                    label="Kuljettajan nimi"
                                      
                    options={drivers.map(formatDriverOption)}
                    onChange={onDriverSelectionChanges}
                    success={false}
                    error={false}></SelectField>
      </div>
      <div className="col-4 d-flex align-items-end">
        <button type="button" className="btn btn-primary" onClick={addDriver}>Lisää</button>
      </div>
      </>
    )}
    {!edit && (
      <div className="col-12">
        <button type="button" 
                className="btn btn-primary" 
                disabled={drivers.length === 0}
                onClick={onClick}>Lisää kuski</button>  
      </div>
    )}
    </div>
  )
}