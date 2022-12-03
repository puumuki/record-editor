import SecondParts from "../../lib/second-parts";

import { isAdmin } from "../../lib/helpers";
import { useTranslation } from 'react-i18next';
import { Car, Driver, Record, Track } from "../../types/types";
import Score from "../Score";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

interface RaceRecorderTableRowsProp {   
    record_id?: number,   
    track_id?:number, 
    drivers:Driver[], 
    tracks:Track[], 
    cars: Car[],
    records: Record[],
    modify_record_id?: number,
}

const RaceRecorderTableRows = (props:RaceRecorderTableRowsProp) => {
    
    const { data: session } = useSession();
    const {t, i18n} = useTranslation();
    const {record_id, drivers, records, cars, modify_record_id} = props;
  
    const rows =  records.slice().sort((recordA, recorB) => {
      return recordA.time - recorB.time;
    }).map( (record, index) => {

      let rowStyleClass = record_id && record_id === record.id ? 'animate__animated animate__bounce' : '';
      rowStyleClass += modify_record_id === record.id ? ' beign-modified' : '';

      const driver = drivers.find( driver => driver.id === record.drivers_id );
      const car = cars.find( car => car.id === record.cars_id );
      
      return <tr key={`tr-record-${index}`} className={rowStyleClass}>
        <td>{new SecondParts(record.time).format}</td>
        <td>{driver?.name}</td>
        <td>{car?.name}</td>
        <td><Score score={car?.scores} /></td>
        {isAdmin(session) && ( 
          <td className={`text-end`}>
            <button type="button" 
                      data-record-id={record.id}
                      className="btn btn-primary modify-record me-sm-2 mb-2 mb-sm-0" >{t('racerecorder.modify')}</button>          
            <button type="button" 
                      data-record-id={record.id}
                      className="btn btn-primary delete-record" >{t('racerecorder.delete')}</button>
          </td>)}
      </tr>
    }) 

    return <>{rows}</>;
}

export default RaceRecorderTableRows;