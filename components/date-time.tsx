
import { dateTimeSeparated, dateTimeSeparatedToUnixTime } from "../lib/date-helper";

export default function DateTimeField({id, name, label, error=false, success=false, onChange, value}) {

  const {date, time} = dateTimeSeparated( value );

  function onDateChange(event) {          
    onChange(dateTimeSeparatedToUnixTime({date:  event.target.value, time}));    
  }

  function onTimeChange(event) {    
    onChange(dateTimeSeparatedToUnixTime({date, time: event.target.value}));
  }  

  return (
    <div className="row">
      <label className="form-label col-12" htmlFor={id}>{label}</label>      
      <div className="col-6">
        <input type='date' 
              name={name} 
              id={id}
              onChange={onDateChange}
              defaultValue={date}             
              className={`form-control ${error ? 'is-invalid' : ''} ${success ? 'is-valid' : '' }`} 
              aria-describedby={`validation-message-${id}`}></input>
      </div>            
      <div className="col-6">
        <input type='time' 
              name={name} 
              id={id}
              onChange={onTimeChange}
              defaultValue={time}             
              className={`col-6 form-control ${error ? 'is-invalid' : ''} ${success ? 'is-valid' : '' }`} 
              aria-describedby={`validation-message-${id}`}></input>                                     
      </div>
      <div id={`validation-message-${id}`} className="invalid-feedback">{error}</div> 
    </div>
  )
}