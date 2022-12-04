import { Car } from '../../types/types'

interface CarOptionSpanProps {
  car: Car
}

const CarOption = (props: CarOptionSpanProps): React.ReactElement => {
  if (props.car.scores > 0) {
    return (
      <>
        {props.car.name} - {props.car.scores}
      </>
    )
  } else {
    return <>{props.car.name}</>
  }
}

export default CarOption
