

export default function TextArea({id, name, type = 'text', label, error, success}) {
  return (
    <>
      <label className="form-label" htmlFor={id}>{label}</label>
      <textarea type={type} 
            name={name} 
            id={id}             
            className={`form-control ${error ? 'is-invalid' : ''} ${success ? 'is-valid' : '' }`} 
            aria-describedby={`validation-message-${id}`} ></textarea>                    
      <div id={`validation-message-${id}`} className="invalid-feedback">{error}</div>
    </>
  )
  

}