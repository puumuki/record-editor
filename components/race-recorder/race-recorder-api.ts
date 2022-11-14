import {Track, Driver, Car, Record} from '../../lib/race-recorder/types';

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

export async function getCars():Promise<Car[]> {
  const response = await fetch('/api/cars', {          
    headers: { 'Content-Type': 'application/json' },      
    method: 'GET',
  }); 

  const responseData = await response.json();
  return responseData.data;
}

export async function createRecord(record:Record):Promise<Record> {
  const response = await fetch('/api/record', {          
    headers: { 'Content-Type': 'application/json' },      
    method: 'POST',
    body: JSON.stringify(record)
  }); 

  const responseData = await response.json();
  return responseData.data;
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
