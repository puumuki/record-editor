interface WarningMessageProps {
  title: string
  message: string
}

export default function WarningMessage(props: WarningMessageProps): React.ReactElement {
  return (
    <div className="alert alert-warning" role="alert">
      {props.title && <h4>{props.title}</h4>}
      {props.message && <p>{props.message}</p>}
    </div>
  )
}
