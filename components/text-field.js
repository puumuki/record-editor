

export default function TextField({
  id, 
  name, 
  type = 'text', 
  label="", 
  error=false, 
  success=false,
  onChange=null, 
  onKeyDown=null,
  value="", 
  placeholder=""
}) {
  return (
    <>
      {label && (
        <label className="form-label" htmlFor={id}>{label}</label>
      )}      
      <input type={type} 
            name={name} 
            id={id}
            onChange={onChange}
            defaultValue={value}             
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            className={`form-control ${error ? 'is-invalid' : ''} ${success ? 'is-valid' : '' }`} 
            aria-describedby={`validation-message-${id}`}></input>                    
      <div id={`validation-message-${id}`} className="invalid-feedback">{error}</div>
    </>
  )
  

}