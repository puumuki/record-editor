import {Query} from 'pg';

import connection from '../../lib/race-recorder/postgresql-connection';
import { Track, Record, Car, Driver } from './types';

/**
 * Log error message to console
 * @param error 
 */
function logErrors( error:any ) {
  console.log( "XD", error.message, error.stack );
}

// --- Data reading queries --
export async function getCars():Promise<Car[]> {
  const sql = `select * from cars WHERE deleted = false;`;
  const result = await connection.query(sql);
  return result.rows;
}

export async function getCar(id:number):Promise<Car|null> {
  const sql = `select * from cars WHERE id = $1 AND deleted = false;`;
  const result = await connection.query(sql, [id]);  
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getRecord(id:number):Promise<Record|null> {
  const sql = `select * from records WHERE id = $1 AND deleted = false;`;
  const result = await connection.query(sql, [id]);  
  return result.rows.length > 0 ? result.rows[0] : null;
}


export async function getDrivers():Promise<Driver[]> {
  const sql = `SELECT * FROM drivers ORDER BY drivers.order ASC;`;
  const result = await connection.query(sql);
  return result.rows;
}

export async function getTracks():Promise<Track[]> {
  const sql = /*sql*/`SELECT * FROM tracks;`;
  const result = await connection.query(sql);  
  return result.rows;
}

export async function getRecords() {
  const sql = /*sql*/`SELECT 
  tracks.id as track_id, 
  records.time as record_time,
  records.drivers_id as record_driver_id,
  records.id as record_id,
  records.tracks_id as tracks_id,
  records.cars_id as tracks_cars_id

  FROM tracks 
  LEFT JOIN records ON records.tracks_id = tracks.id
  
  WHERE tracks.deleted = false AND records.deleted = false
  ORDER BY tracks_id, record_time ASC
  ;`;

  const result = await connection.query(sql);
  
  //For some reason bigint datatype is returned as a string, here we convert it to int.
  return result.rows.map( row => {
    row.record_time = row.record_time;    
    return row;
  });
}

// --- INSERT & UPDATED queries --

export async function createRecord(record:Record):Promise<Record> {
  const client = await connection.connect();

  try {
    await client.query('BEGIN');
    const result = await client.query('INSERT INTO records(time, drivers_id, cars_id, tracks_id) VALUES($1, $2, $3, $4) RETURNING id;', 
                                      [record.time, record.drivers_id, record.cars_id, record.tracks_id])
    record.id = result.rows[0].id;      
    await client.query('COMMIT');    
  } catch( error ) {    
    logErrors(error);
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  return record;
}

export async function updateRecord(record:Record):Promise<Record>  {
  const client = await connection.connect(); 

  try {
    await client.query('BEGIN');
    await client.query('UPDATE records SET time=$1, drivers_id=$2, cars_id=$3, tracks_id=$4 WHERE id = $5 AND deleted = false;', 
                       [record.time, record.drivers_id, record.cars_id, record.tracks_id, record.id])
    await client.query('COMMIT');    
  } catch( error ) {    
    logErrors(error);
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }  

  return record;
}

export async function deleteRecord(record:Record):Promise<Record>  {
  const client = await connection.connect(); 

  try {
    await client.query('BEGIN');
    await client.query('UPDATE records SET deleted=true WHERE id = $1 AND deleted = false;', [record.id])
    await client.query('COMMIT');    
  } catch( error ) {    
    logErrors(error);
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }  

  return record;
}



export async function createCar(car:Car):Promise<Car> {
  const client = await connection.connect();

  try {
    await client.query('BEGIN');
    const result = await client.query('INSERT INTO cars("name","scores","drivers_id") VALUES ($1, $2, $3) RETURNING id;', [car.name, car.scores, car.drivers_id])
    car.id = result.rows[0].id;      
    await client.query('COMMIT');    
  } catch( error ) {    
    logErrors(error);
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  return car;
}

export async function updateCar(car:Car):Promise<Car>  {
  const client = await connection.connect(); 

  try {
    await client.query('BEGIN');
    await client.query('UPDATE cars SET name=$1, scores=$2 WHERE id = $3 AND deleted = false;', [car.name, car.scores,car.id])
    await client.query('COMMIT');    
  } catch( error ) {    
    logErrors(error);
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }  

  return car;
}

export async function deleteCar(car:Car):Promise<Car>  {
  const client = await connection.connect(); 

  try {
    await client.query('BEGIN');
    await client.query('UPDATE cars SET deleted=true WHERE id = $1 AND deleted = false;', [car.id])
    await client.query('COMMIT');    
  } catch( error ) {    
    logErrors(error);
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }  

  return car;
}

export async function createTrack(track:Track):Promise<Track> {
  const client = await connection.connect();

  try {
    await client.query('BEGIN');
    const result = await client.query('INSERT INTO tracks("name") VALUES ($1) RETURNING id;', [track.name])
    track.id = result.rows[0].id;      
    await client.query('COMMIT');    
  } catch( error ) {    
    logErrors(error);
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  return track;
}

export async function updateTrack(track:Track):Promise<Track>  {
  const client = await connection.connect(); 

  try {
    await client.query('BEGIN');
    await client.query('UPDATE tracks SET name=$1 WHERE id = $2', [track.name,track.id])
    await client.query('COMMIT');    
  } catch( error ) {    
    logErrors(error);
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }  

  return track;
}

function queryUpdateRecord(record:Record) {
  const sql = /*sql*/`UPDATE records SET 
    "time" = $1,
    "drivers_id" = $2,    
  WHERE id = $3; `;
  
  return new Query( sql, [record.time, record.drivers_id, record.id])  
}

function queryCreateRecord(record:Record) {
  const sql = /*sql*/`INSERT INTO records (time, drivers_id, cars_id, tracks_id) VALUES (
    $1, $2, $3, $4
  );`;  
  return new Query( sql, [record.time, record.drivers_id, record.cars_id, record.tracks_id])  
}


