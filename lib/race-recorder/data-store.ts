import {Query} from 'pg';

import connection from '../../lib/race-recorder/postgresql-connection';
import { Session, Track, Record } from './types';

export enum DatabaseSequences {
  Drivers = 'drivers_id_seq',
  Records = 'records_id_seq',
  Tracks = 'tracks_id_seq',
  Sessions = 'sessions_id_seq'  
}

// --- Data reading queries --

export async function getDrivers() {
  const sql = `SELECT * FROM drivers ORDER BY drivers.order ASC;`;
  const result = await connection.query(sql);
  return result.rows;
}

export async function getTracks() {
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

export async function createTrack(track:Track):Promise<Track> {
  const client = await connection.connect();

  try {
    await client.query('BEGIN');
    const result = await client.query('INSERT INTO tracks("name") VALUES ($1) RETURNING id;', [track.name])
    track.id = result.rows[0].id;      
    await client.query('COMMIT');    
  } catch( error ) {
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
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }  
}

//export async function createRecord(record:Record) {}

// -- Query objects --

function queryLastInsertedId(sequence:DatabaseSequences) {
  const sql = `SELECT currval($1)`;
  return new Query( sql, [sequence.valueOf()] );
}

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


