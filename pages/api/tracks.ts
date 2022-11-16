

import type { NextApiRequest, NextApiResponse } from "next";
import {getRecords, getTracks} from '../../lib/race-recorder/data-store'
import { Record } from "../../types/types";

export default async function handler(request:NextApiRequest, response:NextApiResponse) {
  
  const tracks = await getTracks();      
  const records = await getRecords();
  
  const data = tracks.map( track => {

    return {
      id: track.id,
      name: track.name,
      description: track.description,
      records: records.filter( (record:any) => record.track_id === track.id ).map( record => {
                
        const recordObject:Record = {
          id: record.record_id,
          time: record.record_time,
          cars_id: record.tracks_cars_id,
          drivers_id: record.record_driver_id,
          tracks_id: record.tracks_id
        };
        
        return recordObject;
      })
    };
  })

  response.json({
    status: 200,
    data: data,
    message: 'Success fetching tracks data.'
  });
}