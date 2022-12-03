import { useEffect } from "react";



/**
 * Add eventlistener to Window
 * @param props control paramters
 */
const useWindowEventListener = ( event: string, callback:EventListenerOrEventListenerObject ) => {

  useEffect(() => {    
    window.addEventListener(event, callback);

    return () => {
      window.removeEventListener(event, callback);
    }
  },[]);
}

export default useWindowEventListener;