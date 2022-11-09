
export default function SelectField({id, name, options, label, onChange=null, error, success}) {

  return (
    <>
      <label className="form-label" htmlFor={id}>{label}</label>
      <select id={id} 
              name={name} 
              onChange={onChange}
              className={`form-control ${error ? 'is-invalid' : ''} ${success ? 'is-valid' : '' }`} 
              aria-describedby={`validation-message-${id}`}>

        {options.map((option, i) => {     
           return (<option key={option.value} value={option.value}>{option.text}</option>) 
        })}

      </select>     
      <p id={`validation-message-${id}`} className="invalid-feedback">{error}</p>    
    
    </>
  )

}


