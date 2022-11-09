
import { dateTimeSeparated, dateTimeSeparatedToUnixTime } from "../lib/date-helper";

interface DateTimeFieldProps {
  id: string,
  name: string,
  label: string,
  error?: boolean,
  success?: boolean,
  onChange: Function,
  value: number
}


export default function DateTimeField(props:DateTimeFieldProps) {

  const {id, name, label, error=false, success=false, onChange, value} = props;
  
  const {date, time} = dateTimeSeparated( value );

  function onDateChange(event:React.ChangeEvent<HTMLInputElement>) {              
    onChange(dateTimeSeparatedToUnixTime({date: event.target.value, time}));    
  }

  function onTimeChange(event:React.ChangeEvent<HTMLInputElement>) {        
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
              defaultValue={date ?? undefined}             
              className={`form-control ${error ? 'is-invalid' : ''} ${success ? 'is-valid' : '' }`} 
              aria-describedby={`validation-message-${id}`}></input>
      </div>            
      <div className="col-6">
        <input type='time' 
              name={name} 
              id={id}
              onChange={onTimeChange}
              defaultValue={time ?? undefined}             
              className={`col-6 form-control ${error ? 'is-invalid' : ''} ${success ? 'is-valid' : '' }`} 
              aria-describedby={`validation-message-${id}`}></input>                                     
      </div>
      <div id={`validation-message-${id}`} className="invalid-feedback">{error}</div> 
    </div>
  )
}