
interface TextAreaProps {
  id: string, 
  name: string, 
  label?: string, 
  error?: boolean, 
  success?: boolean,
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>, 
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>,
  value: string, 
  placeholder?: string
}

export default function TextArea(props:TextAreaProps) {

  const {id, name, label, error, success, placeholder, value, onChange} = props;

  return (
    <>
      <label className="form-label" htmlFor={id}>{label}</label>
      <textarea 
            name={name} 
            id={id}             
            defaultValue={value}             
            placeholder={placeholder}            
            className={`form-control ${error ? 'is-invalid' : ''} ${success ? 'is-valid' : '' }`} 
            onChange={onChange}
            aria-describedby={`validation-message-${id}`} ></textarea>                    
      <div id={`validation-message-${id}`} className="invalid-feedback">{error}</div>
    </>
  )
  

}