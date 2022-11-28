
import type { NextApiRequest, NextApiResponse } from "next";
import {getRecord, createRecord, deleteRecord, updateRecord} from '../../../lib/race-recorder/data-store';
import {createRecordValidator} from "../../../lib/race-recorder/schema-validtor";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { isAdmin } from "../../../lib/helpers";

export default async function handler(request:NextApiRequest, response:NextApiResponse) {

  //Protect data manipulating operations 
  if(request.method !== 'GET') {
    const session = await unstable_getServerSession(request, response, authOptions);    

    if(!isAdmin(session)) {
      return response.status(401).json({ status: 401, message: 'Permission denied' });
    }
  }

  const validator = createRecordValidator();
  const data = request.body;

  if( request.query.params === undefined ) {

    if(request.method === 'DELETE' || request.method === 'PUT') {
      const recordData = getRecord(data.id);
      
      if( !recordData ) {
        return response.json({ status: 404, data: null, message: `record not found from database with the given id ${data.id}`});
      }
    }

    if( request.method === 'GET') {
      const record = await getRecord(data.id);
      if( record ) {
        return response.json({ status: 200, data: record, message: `Found a record: record.id = ${record?.id}` });      
      } else {
        return response.json({ status: 404, data: null, message: `Record not found with given id: record.id = ${data?.id}` });      
      }      
    }

    if( request.method === 'DELETE') {
      const record = await deleteRecord(data);
      return response.json({ status: 200, data: record, message: `Deleted record: record.id = ${record.id}` });         
    }    

    const isValid = validator({ ...data });

    if( isValid ) {
      if( request.method === 'POST') {            
        const record = await createRecord(data);
        return response.json({ status: 200, data: record, message: `Created record: record.id = ${record.id}` });      
      }
  
      if( request.method === 'PUT') {
        const record = await updateRecord(data);
        return response.json({ status: 200, data: record, message: `Updated record: record.id = ${record.id}` });               
      }
    } else {
      return response.json({
        status: 403,
        data: validator.errors,
        message: 'Bad request'
      }) 
    }
  } 

  return response.json({
    status: 403,
    message: `Bad request`
  });
}