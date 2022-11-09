import {getDrivers} from '../../lib/race-recorder/data-store'

export default async function handler(request, response) {
  try {
    const drivers = await getDrivers();  
    response.json({
      status: 200,
      data: drivers,
      message: 'Success fetching tracks data.'
    })
  } catch( error ) {
    response.json({
      status: 500,
      message: `Error while fetching tracks data: ${error.message}`
    });
  }  
}