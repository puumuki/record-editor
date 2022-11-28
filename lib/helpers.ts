import { Session } from "next-auth";
import { Car, Track } from "../types/types";

export function sortCarsAlphabetically(cars:Car[]):Car[] {
  return cars.slice().sort((a:Car, b:Car) => {
    return a.name.localeCompare( b.name );
  });
}

export function sortCarsByScores( cars:Car[] ) {
  return cars.slice().sort((a:Car, b:Car) => {
    return b.scores - a.scores ;
  });
}

export function sortTrackAlphabetically(cars:Track[]):Track[] {
  return cars.slice().sort((a:Track, b:Track) => {
    return a.name.localeCompare( b.name );
  });
}

export function isAdmin(session:Session|null):boolean {
  return session?.user?.role === 'admin' ?? false;
}