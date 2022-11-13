import type { NextApiRequest, NextApiResponse } from "next";
import {createTrack, updateTrack} from '../../../lib/race-recorder/data-store';
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request:NextApiRequest, response:NextApiResponse) {
     
  //Protect data manipulating operations 
  if(request.method !== 'GET') {
    const session = await unstable_getServerSession(request, response, authOptions);

    if(!session) {
      return response.status(401).json({ status: 401, message: 'Permission denied' });   
    }
  }

  const data = request.body;

  if( request.query.params === undefined ) {
    if( data.id === null ) {
      const track = await createTrack( data );
      response.json({
        status: 200,
        data: track,
        message: `Track created: track.id = ${track.id}`
      })      
    } else if(typeof data.id === 'number') {
      const track = await updateTrack( data );
      response.json({
        status: 200,
        data: track,
        message: `Updated track: track.id = ${track.id}`
      })            
    }   
  } else {
    response.json({
      status: 403,
      message: `Bad request`
    });
  }
}