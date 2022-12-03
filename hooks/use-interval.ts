import { useEffect } from "react";

interface PeriodicUpdateProps {
  interval: number,
  callback: Function,
}

/**
 * Periodically
 * @param props control paramters
 */
const useInterval = (props:PeriodicUpdateProps) => {

  const { interval, callback } = props;

  useEffect( () => {
    const intervalId = setInterval( callback, interval );

    return () => {
      clearInterval(intervalId);
    }
  });
}

export default useInterval;