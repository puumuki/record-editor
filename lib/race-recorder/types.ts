export interface Driver {
  id: number|null,
  name: string,
  order: number
}

export interface Record {
  id: number|null,
  time: number,
  cars_id?: number|null,
  drivers_id?: number|null,  
  tracks_id?: number|null
}

export interface Track {
  id: number|null,
  name: string,
  description?: string,
  records: Record[]
}

export interface Car {
  id: number|null,
  name: string,
  scores: number,
  drivers_id?: number|null  
}