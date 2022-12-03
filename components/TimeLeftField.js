import SecondParts from "../lib/second-parts"

export default function TimeLeftField({seconds}) {
  if( seconds === undefined ) {
    return <span> -- : -- : --</span> 
  } else {
    const secondParts = new SecondParts( seconds );
    const {minutes, seconds: timeSeconds, hundredths} = secondParts.parts;
    return  <span>{minutes}:{timeSeconds}:{hundredths}</span>
  }
}