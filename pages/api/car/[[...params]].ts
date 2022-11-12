
import type { NextApiRequest, NextApiResponse } from "next";
import {getCar, createCar, deleteCar, updateCar} from '../../../lib/race-recorder/data-store';
import {createCarsValidator} from "../../../lib/race-recorder/schema-validtor";

export default async function handler(request:NextApiRequest, response:NextApiResponse) {

  const validator = createCarsValidator();
  const data = request.body;

  if( request.query.params === undefined ) {

    if(request.method === 'DELETE' || request.method === 'PUT') {
      const carData = getCar(data.id);
      
      if( !carData ) {
        return response.json({ status: 404, data: null, message: `Car not found from database with the given id ${data.id}`});
      }
    }

    if( request.method === 'GET') {
      const car = await getCar(data.id);
      if( car ) {
        return response.json({ status: 200, data: car, message: `Found a car: car.id = ${car?.id}` });      
      } else {
        return response.json({ status: 404, data: null, message: `Car not found with given id: car.id = ${data?.id}` });      
      }      
    }

    if( request.method === 'DELETE') {
      const car = await deleteCar(data);
      return response.json({ status: 200, data: car, message: `deleted car: car.id = ${car.id}` });         
    }    

    const isValid = validator({ ...data });

    if( isValid ) {
      if( request.method === 'POST') {            
        const car = await createCar(data);
        return response.json({ status: 200, data: car, message: `Created car: car.id = ${car.id}` });      
      }
  
      if( request.method === 'PUT') {
        const car = await updateCar(data);
        return response.json({ status: 200, data: car, message: `Updated car: car.id = ${car.id}` });               
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