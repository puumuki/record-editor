interface TimeViewProps {
  seconds: number
}

const TimeView = (props: TimeViewProps): React.ReactElement => {
  const hours = Math.floor(props.seconds / 3600)
  const minutes = Math.floor((props.seconds % 3600) / 60)
  const seconds = Math.floor(props.seconds % 60)
  return (
    <span>
      {hours}h {minutes}min {seconds}s
    </span>
  )
}

export default TimeView
