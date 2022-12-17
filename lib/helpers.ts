import { Session } from 'next-auth'
import { Car, Track } from '../types/types'

/**
 * Sort cars alphabetically by car's name
 * @param cars driver's cars
 * @returns sorted car array
 */
export function sortCarsAlphabetically(cars: Car[]): Car[] {
  return cars.slice().sort((a: Car, b: Car) => {
    return a.name.localeCompare(b.name)
  })
}

/**
 * Sort cars by car's parformance scores
 * @param cars driver's cars
 * @returns sorted car array
 */
export function sortCarsByScores(cars: Car[]): Car[] {
  return cars.slice().sort((a: Car, b: Car) => {
    return b.scores - a.scores
  })
}

/**
 * Sort tracks alphabetically by car's name
 * @param tracks tracks
 * @returns sorted car array
 */
export function sortTrackAlphabetically(tracks: Track[]): Track[] {
  return tracks.slice().sort((a: Track, b: Track) => {
    return a.name.localeCompare(b.name)
  })
}

/**
 * Check is user a admin
 * @param session NextAuth session object
 * @returns true if use is an admin false if not
 */
export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === 'admin' ?? false
}
