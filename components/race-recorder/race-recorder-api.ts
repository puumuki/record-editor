import {Track, Driver, Session} from '../../lib/race-recorder/types';


export async function getDrivers():Promise<Driver[]> {
  const response = await fetch('/api/drivers', {          
    headers: { 'Content-Type': 'application/json' },      
    method: 'GET',
  }); 

  const responseData = await response.json();
  return responseData.data;
}

export async function getAllTracks():Promise<Track[]> {
  const response = await fetch('/api/tracks', {          
    headers: { 'Content-Type': 'application/json' },      
    method: 'GET',
  }); 

  const responseData = await response.json();
  return responseData.data;
}

interface TrackSessionPayload {
  trackId: number,
  session: Session
}

export async function updateTrackSession(payload:TrackSessionPayload):Promise<TrackSessionPayload> {
     
    const response = await fetch(`/api/track/${payload.trackId}/session`, {          
      headers: { 'Content-Type': 'application/json' },      
      body: JSON.stringify( payload.session ),
      method: 'POST',
    }); 
  
    const responseData = await response.json();
    return { trackId: payload.trackId, session: responseData.data };
}

export async function updateTrackDrivers( updatedTrack: Track ):Promise<Track> {

  const response = await fetch('/api/drivers', {          
    headers: { 'Content-Type': 'application/json' },      
    body: JSON.stringify( updatedTrack ),
    method: 'POST',
  }); 

  const responseData = await response.json();
  return responseData.data;
}

export async function deleteTrackSession(payload:Session):Promise<Session> {
     
  const response = await fetch(`/api/track/${payload.tracks_id}/delete`, {          
    headers: { 'Content-Type': 'application/json' },      
    body: JSON.stringify(payload),
    method: 'DELETE',
  }); 

  const responseData = await response.json();
  return responseData.data;
}

export async function addTrack(payload:Track):Promise<Track> {
  return await updateTrack(payload)
}

export async function updateTrack(payload:Track):Promise<Track> {
     
  const response = await fetch(`/api/track/`, {          
    headers: { 'Content-Type': 'application/json' },      
    body: JSON.stringify(payload),
    method: 'POST',
  }); 

  const responseData = await response.json();
  return responseData.data;
}
