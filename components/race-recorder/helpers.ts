import { Session } from "../../lib/race-recorder/types";

export function sortSessionByTime(a:Session, b:Session) {
  if( a.time > b.time ) {
    return -1;
  } else if( a.time < b.time ) {
    return 1;
  } else {
    return 0;
  }
}