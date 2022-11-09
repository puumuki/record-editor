export interface Driver {
  id: number|null,
  name: string,
  order: number
}

export interface Record {
  id: number|null,
  time: number,
  drivers_id?: number|null,
  sessions_id?: number|null
}

export interface Session {
  id: number|null,
  time: number,
  tracks_id?: number|null,      
  records: Record[]
}

export interface Track {
  id: number|null,
  name: string,
  sessions: Session[]
}