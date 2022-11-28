import scoresToPerformanceIndex from "../../lib/performance-index";
import { Car } from "../../types/types";

interface CarOptionSpanProps {
  car: Car
}

const CarOption = (props:CarOptionSpanProps) => {
  if( props.car.scores > 0 ) {
    const perfomanceIndex = scoresToPerformanceIndex(props.car.scores);
    return <>{props.car.name} - {props.car.scores}</>
  } else {
    return <>{props.car.name}</>
  }
}

export default CarOption;