import type { NextApiRequest, NextApiResponse } from "next";
import {getCars} from '../../lib/race-recorder/data-store'

export default async function handler(request:NextApiRequest, response:NextApiResponse) {
  try {
    const cars = await getCars();  
    response.json({
      status: 200,
      data: cars,
      message: 'Success cars data.'
    })
  } catch( error:any ) {
    response.json({
      status: 500,
      message: `Error while fetching tracks data: ${error.message}`
    });
  }  
}