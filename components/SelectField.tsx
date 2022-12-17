import React from 'react'

export interface SelectFieldOption {
  value: string
  text: string
}

interface SelectFieldProps {
  id: string
  name: string
  type?: string
  label?: string
  error?: boolean
  success?: boolean
  options: SelectFieldOption[]
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
  value?: string
}

export default function SelectField(props: SelectFieldProps): React.ReactElement {
  const { id, name, options, label, value, onChange, error, success } = props

  return (
    <>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-control ${error ? 'is-invalid' : ''} ${success ? 'is-valid' : ''}`}
        aria-describedby={`validation-message-${id}`}
      >
        {options.map((option, i) => {
          return (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          )
        })}
      </select>
      <p id={`validation-message-${id}`} className="invalid-feedback">
        {error}
      </p>
    </>
  )
}
