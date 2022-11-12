import {Query} from 'pg';

import connection from '../../lib/race-recorder/postgresql-connection';
import { Session, Track, Record, Car, Driver } from './types';

/**
 * Log error message to console
 * @param error 
 */
function logErrors( error:any ) {
  console.log( error.message, error.stack );
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
		
	sessions.id as session_id,
	sessions.time as session_time,
  sessions.tracks_id as session_tracks_id,
	
	records.time as record_time,
	records.drivers_id as record_driver_id,
  records.id as record_id

  FROM tracks 
  LEFT JOIN sessions ON sessions.tracks_id = tracks.id
  LEFT JOIN records ON records.sessions_id = sessions.id
  
  WHERE sessions.deleted = false;`;

  const result = await connection.query(sql);
  
  //For some reason bigint datatype is returned as a string, here we convert it to int.
  return result.rows.map( row => {
    row.record_time = row.record_time;
    row.session_time = parseInt(row.session_time);
    return row;
  });
}

// --- INSERT & UPDATED queries --

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

export async function deleteSession(session:Session) {
  const client = await connection.connect();

  try {
    await client.query('BEGIN');
    await client.query('UPDATE sessions SET deleted = true WHERE id = $1', [session.id])
    await client.query('COMMIT');    
  } catch( error ) {    
    logErrors(error);
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  return session;
}

/**
 * Update sessions information
 * @param session single race session information 
 * @throw {Error} if update faces an error
 */
export async function updateSession(session:Session) {

  const client = await connection.connect()

  try {    
    await client.query('BEGIN');

    if( session.id ) {
      await client.query( queryUpdateSession(session) );
    } else {
      //This is only way I got client.query to return that id.. 
      const result = await client.query(`INSERT INTO sessions ("time", "tracks_id") VALUES ( $1, $2 ) RETURNING id`,[ session.time, session.tracks_id ]);
      session.id = result.rows[0].id;      
    }

    const promises = session.records.map( record => {
      
      const data = {
        id: record.id,
        time: record.time,
        drivers_id: record.drivers_id,
        sessions_id: session.id
      }

      let query;

      if( data.id ) {        
        return client.query( queryUpdateRecord(data) );    
      } else {        
        return client.query( queryCreateRecord(data) )        
      }          
    })

    await Promise.all(promises);
        
    await client.query('COMMIT');
  } catch(error) {    
    logErrors(error);
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }  
}




//export async function createRecord(record:Record) {}

// -- Query objects --
function queryCreateSession(session:Session) {
  const sql = /*sql*/`INSERT INTO sessions (
    "time"
  ) VALUES ( $1 ) RETURNING id`;

  return new Query( sql, [session.time]);
}

function queryUpdateSession(session:Session) {
  const sql = /*sql*/`UPDATE sessions SET 
    "time" = $1
  WHERE id = $2; `;

  return {
   text: sql, 
   values: [session.time, session.id]
  }
}

function queryUpdateRecord(record:Record) {
  const sql = /*sql*/`UPDATE records SET 
    "time" = $1,
    "drivers_id" = $2,
    "sessions_id" = $3
  WHERE id = $4; `;
  
  return new Query( sql, [record.time, record.drivers_id, record.sessions_id, record.id])  
}

function queryCreateRecord(record:Record) {
  const sql = /*sql*/`INSERT INTO records (time, drivers_id, sessions_id) VALUES (
    $1, $2, $3
  ) 
  ;`;  
  return new Query( sql, [record.time, record.drivers_id, record.sessions_id])  
}


