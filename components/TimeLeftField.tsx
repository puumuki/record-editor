import SecondParts from '../lib/second-parts'

interface TimeLeftFieldProps {
  seconds?: number
}

export default function TimeLeftField({ seconds }: TimeLeftFieldProps): React.ReactElement {
  if (seconds === undefined) {
    return <span> -- : -- : --</span>
  } else {
    const secondParts = new SecondParts(seconds)
    const { minutes, seconds: timeSeconds, hundredths } = secondParts.parts
    return (
      <span>
        {minutes}:{timeSeconds}:{hundredths}
      </span>
    )
  }
}
