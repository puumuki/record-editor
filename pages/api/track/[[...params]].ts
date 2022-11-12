import type { NextApiRequest, NextApiResponse } from "next";
import {createTrack, updateTrack, updateSession, deleteSession} from '../../../lib/race-recorder/data-store';
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request:NextApiRequest, response:NextApiResponse) {
     
  //Protect data manipulating operations 
  if(request.method !== 'GET') {
    const session = await unstable_getServerSession(request, response, authOptions);

    console.log("Session", JSON.stringify(session, null, 2))

    if(!session) {
      return response.status(401).json({ status: 401, message: 'Permission denied' }).end();      
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
  } else if( request.query?.params?.length == 2 ) {

    const [trackId, action] = request.query.params;    

    if( action === 'session' && request.method === 'POST') {   
      data.tracks_id = trackId;   
      await updateSession( data );            
      response.json({
        status: 200,               
        message: `Session udpated: session.id = ${data.id}`
      });

    } else if( action === 'delete' && request.method === 'DELETE') {
  
      await deleteSession( data );

      response.json({
        status: 200,               
        message: `Session udpated: session.id = ${data.id}`
      });

    } else {
      response.json({
        status: 404,
        message: `Track not found with track id ${trackId}`
      });
    }

  } else {
    response.json({
      status: 403,
      message: `Bad request`
    });
  }


}