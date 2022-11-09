

import type { NextApiRequest, NextApiResponse } from "next";
import {getRecords, getTracks} from '../../lib/race-recorder/data-store'

export default async function handler(request:NextApiRequest, response:NextApiResponse) {
  
  const tracks = await getTracks();      
  const records = await getRecords();
  
  const data = tracks.map( track => {

    const tracksRecords = records.filter( record => record.track_id === track.id )           
    const uniqueSessionIds = new Set<number>(tracksRecords.map( record => record.session_id ));
  
    const sessions = Array.from<number>(uniqueSessionIds).map( sessionId => {              

      const session = records.find( record => record.session_id === sessionId );
      const sessionsRecords = tracksRecords.filter( record => record.session_id === sessionId );

      return {
        id: session.session_id,
        time: session.session_time,
        tracks_id: track.id,
        records: sessionsRecords.map( record => { 
          return {                          
            id: record.record_id,
            time: record.record_time,
            drivers_id: record.record_driver_id 
          }
        })
      }
    });

    return {
      id: track.id,
      name: track.name,
      sessions
    };
  })

  response.json({
    status: 200,
    data: data,
    message: 'Success fetching tracks data.'
  });
}