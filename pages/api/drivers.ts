import type { NextApiRequest, NextApiResponse } from "next";
import {getDrivers} from '../../lib/race-recorder/data-store'

export default async function handler(request:NextApiRequest, response:NextApiResponse) {
  try {
    const drivers = await getDrivers();  
    response.json({
      status: 200,
      data: drivers,
      message: 'Success fetching tracks data.'
    })
  } catch( error:any ) {
    response.json({
      status: 500,
      message: `Error while fetching tracks data: ${error.message}`
    });
  }  
}