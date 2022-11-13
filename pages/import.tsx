import Head from 'next/head';
import Header from '../components/Header';
import React, { useState } from 'react';
import yaml, { YAMLException } from 'js-yaml';
import { Track, Driver, Record } from '../lib/race-recorder/types';
import SecondParts from '../lib/second-parts';

type ImportRecord = {
  time: number,
  driver: number,
  car: ImportCar
}

type ImportTrack = {  
  name: string,  
  records: ImportRecord[]
}

type ImportData = {
  tracks: ImportTrack[],
  cars: {
    [key: string]: Set<string>
  }
}

type ImportCar = {
  name: string,
  driver_id: number 
}

type ImportDataState = {  
  yamlTextAreaContent:string,  
  sqlTextAreaContent:string,
  errorText?: string
}

const initialState:ImportDataState = {
  yamlTextAreaContent: '',
  sqlTextAreaContent: ''
}

const driversLookUp = {
  'Teemu': 1,
  'Toni': 2,
  'Tatu': 3
}  

function convertYamlToData(yamlDocument:any):ImportData {
  

    
  const driverCars = {
    'Teemu': new Set<string>(),
    'Toni': new Set<string>(),
    'Tatu': new Set<string>(),
  }

  const tracks:ImportTrack[] = Object.keys( yamlDocument ).map( key => {
    return {
      name: key,
      records: yamlDocument[key].map( (recordObject:any) => {
        if( recordObject.record ) {
          const secondParts = new SecondParts(recordObject.record.time)
          
          const driverId = driversLookUp[recordObject.record.driver as keyof typeof driversLookUp];

          if( !driverId ) {
            throw Error(`Driver is missing ${JSON.stringify(recordObject.record, null, 2)}`)
          }

          const carSet = driverCars[recordObject.record.driver as keyof typeof driversLookUp];

          carSet.add(recordObject.record.car)

          return {
            time: secondParts.rawvalue, 
            driver: driverId,
            car: recordObject.record.car
          }
        }
      })
    }
  });

  return {
    cars: driverCars,
    tracks,
  }
}

function convertYamlToSQL( importData:ImportData ):string {
  
  let sql = Object.keys( importData.cars ).flatMap( driver => {
    
    const driverId = driversLookUp[driver as keyof typeof driversLookUp];
    const carSet = importData.cars[driver];

    return [ ...carSet ].map(carName => {
      return `INSERT INTO cars (name, drivers_id) VALUES ('${carName}', ${driverId});`
    });    
  }).join('\n');

  sql += '\n\n';

  sql += importData.tracks.map( track => {
    let sql = `INSERT INTO tracks (name) VALUES ('${track.name}');\n`  
  
    sql += track.records.map( record => {    

      const carsSql = record.car ? `(SELECT id FROM cars WHERE name = '${record.car}' AND drivers_id = ${record.driver})` : 'null';

      let sql = `INSERT INTO records (time, drivers_id, cars_id, tracks_id ) VALUES (${record.time}, ${record.driver}, ${carsSql},
        (SELECT id FROM tracks WHERE name = '${track.name}')\n);\n`
      return sql;
    }).join('')  
  
    return sql;
  }).join('\n');

  return sql;
}

export default function ImportData() {    
  const [state, setState] = useState(initialState);

  function onLoadData() {
    try {
      const yamlDocument:any = yaml.load( state.yamlTextAreaContent);            
      const data = convertYamlToData( yamlDocument );                  

      setState({
        ...state,        
        sqlTextAreaContent: `BEGIN;\n ${convertYamlToSQL( data )} COMMIT;`,
        errorText: undefined
      });      

    } catch( error:any ) {
      if(error instanceof  YAMLException) {
        setState({
          ...state,        
          errorText: `YAMException occurred:\n Message: ${error.message}\n Error Stack: ${error.stack}`
        });               
      } else {
        setState({
          ...state,        
          errorText: `Error occurred:\n Message: ${error.message}\n Error Stack: ${error.stack}`
        });              
      }
    }   
  }

  function onYamlTextAreaChanges(event:React.ChangeEvent) {

    const target = event.target as HTMLTextAreaElement;

    setState({
      ...state,
      yamlTextAreaContent: target.value,
      sqlTextAreaContent: ''
    });
  }

  function onSqlTextAreaChanges(event:React.ChangeEvent) {
    
  }

  return (
    <>
      <Head>
        <title>Kilpailurekisteri - Data Import</title>
      </Head>

      <Header></Header>

      <main className='container'>

        <textarea className="form-control" 
                  id="yaml" 
                  value={state.yamlTextAreaContent} 
                  onChange={onYamlTextAreaChanges} rows={10}></textarea>

        <button type="button" className="btn btn-primary" onClick={onLoadData}>Convert to SQL</button>          


        <textarea className="form-control" 
                  id="sql" 
                  value={state.sqlTextAreaContent} 
                  onChange={onSqlTextAreaChanges} rows={10}></textarea>          
      

        {state.errorText && (
          <div className='alert alert-warning mt-5'>
            <pre><code>{state.errorText}</code></pre>
          </div>
        )}


      </main>
    </>
  )
}
