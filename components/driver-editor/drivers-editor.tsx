
import React, { useEffect, useRef  } from 'react';
import { sortCarsAlphabetically, sortCarsByScores } from '../../lib/helpers';

import { 
  fetchDriversCars, FilterDriverState, setDriverId, setFiltersState, setCarId, setCarName, updateCar, createCar, setCarScore, setFocus, setOrder
} from './driver-editor-slice';

import { useAppDispatch } from '../race-recorder/hooks';
import { useAppSelector } from '../../lib/store';
import { Car } from '../../types/types';
import HighlightedText from './highlightedtext';
import { batch } from 'react-redux';
//import styles from '../../styles/DriversEditor.module.scss';

export default function DriversEditor() {

  const tableRef = useRef<HTMLTableElement>(null);
  const state = useAppSelector( state => state.drivers );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDriversCars());             
  }, [dispatch]);  

  useEffect(() => {       
    if( state.focus ) {
      const selector = `input[name="${state.focus}"][data-car-id="${state.car_id}"]`;
      const input = tableRef.current?.querySelector(selector) as HTMLInputElement;
      input?.focus();
    }
  });  

  //Clear car's id when a document is clicked outside of the table
  useEffect(() => {

    function onBodyClick(event:MouseEvent) {    
      const target = event.target as Element;
      
      //Click outside table cell
      if( !target.closest('td') ) {
        batch(() => {
          dispatch(setCarId(undefined)); 
          dispatch(setFocus(undefined));
        })              
      }    
    }
  
    window.addEventListener( 'click', onBodyClick )

    return () => {    //Cleanup
      window.removeEventListener('click', onBodyClick);
    }
  })

  function onDriverTabClicked(event:React.MouseEvent) {
    const target = event.target as HTMLLinkElement;    
    const driverIdNum:number = parseInt( target.dataset.driverId ?? '' );    
    
    batch(() => {
      dispatch(setCarId(undefined));
      dispatch(setDriverId( driverIdNum));      
      dispatch(setCarScore(''));
    })   
  }

  function onFocused(event:React.FocusEvent<HTMLInputElement>) {
    if( state.focus !== event.target.name && (event.target.name === 'carname' ||  event.target.name === 'carscore') ) {
      dispatch(setFocus(event.target.name));
    }    
  }

  function onFilterChange(event:React.ChangeEvent) {
    const target = event.target as HTMLInputElement;      
    const driverIdNum:number = parseInt( target.dataset.driverId ?? '' );   
    
    const filters:FilterDriverState[] = state.filters.map( (filter) => {
      if( filter.driver_id === state.driver_id ) {
        return { driver_id: driverIdNum, filter: target.value };
      } else {
        return filter;
      }      
    });
    
    dispatch(setFiltersState(filters))    
  }

  function onCarClicked(event:React.MouseEvent) {    
    const target = event.target as HTMLElement;    
    
    if( target.tagName !== 'INPUT') {
      const carId = parseInt(target.dataset.carId ?? '');      
      const car = state.cars.find( car => car.id === carId );

      if( car ) {
        batch(() => {
          dispatch(setCarId(carId));
          dispatch(setCarName(car.name));
          dispatch(setCarScore(String(car.scores)));
          dispatch(setFocus('carname'));
        });     
      }            
    }
  }

  const filter = state.filters.find( filter => filter.driver_id === state.driver_id );
  const driverCars: Car[] = state.cars.filter(filterCars);

  function filterCars( car:Car ):boolean {    
    const isCurrentDriverCar:boolean = car.drivers_id === state.driver_id;     

    if( filter && filter.filter.length >= 1  ) {          

      return isCurrentDriverCar && car.name.toLocaleLowerCase().includes(filter.filter.toLocaleLowerCase());
    } else {
      return isCurrentDriverCar;
    }
  }

  function onCarNameChange(event:React.ChangeEvent<HTMLInputElement>) {    
    dispatch(setCarName(event.target.value));
  }

  function saveCarName(event:React.MouseEvent) {
    updateCarData();
  }

  function onCreateCar() {
    batch(() => {
      dispatch(createCar({
        id: null,
        name: state.carname,
        drivers_id: state.driver_id,
        scores: 0
      }));  
      dispatch(setCarId(undefined));      
    });    
  }

  function updateCarData() {
    const car = state.cars.find( car => car.id === state.car_id );
    
    if( car?.id ) {
      batch(() => {
        dispatch(updateCar({
          ...car,
          name: state.carname,
          scores: parseInt(state.carScores)
        }));  
        dispatch(setCarId(undefined));     
      });
    }
  }

  function onCarScoresChanges(event:React.ChangeEvent<HTMLInputElement>) {   
    dispatch(setCarScore(event.target.value))   
  }

  function onKeyUp(event:React.KeyboardEvent) {    
    if(event.code === 'Enter' || event.code === 'NumpadEnter') {
      updateCarData();
    }
    if( event.code === 'ArrowUp') {
      console.log("Move focus up");
    }
    if( event.code === 'ArrowDown') {
      console.log("Move focus up");
    }
  }

  let carsAlfabetically:Car[];

  if( state.order === 'name') {
    carsAlfabetically = sortCarsAlphabetically( driverCars );
  } else {
    carsAlfabetically = sortCarsByScores( driverCars );
  }
  

  return <>    
    <section className="race-recorder container">
    
    <ul className="nav nav-tabs mb-3">
    {state.drivers.map(driver => {
      return (        
        <li key={`${driver.id}-${driver.id}`} className="nav-item">
          <a className={`nav-link ${driver.id === state.driver_id ? 'active' : ''}`}               
             aria-current="page" href={`#driver-${driver.name.toLocaleLowerCase()}`}
             data-driver-id={driver.id}             
             onClick={onDriverTabClicked}>{driver.name}</a>
        </li>
       );
    })}
    </ul>

    {state.drivers.filter( driver => driver.id === state.driver_id ).map(driver => {
        return <div key={driver.id}>        
        
        <div className="row mb-3">

          <div className='col-3 d-flex align-items-end'>
            <div className="input-group">
              <input type="text" 
                     value={state.filters.find( filter => filter.driver_id === state.driver_id )?.filter }
                     data-driver-id={driver.id}                     
                     onChange={onFilterChange}
                     className="form-control" 
                     placeholder="BMW..." 
                     aria-label="Suodata autoja" 
                     aria-describedby={`filter-cars-${driver.name}`}></input>
              <button className="btn btn-primary" type="button" id={`filter-cars-${driver.name}`}>Suodata</button>
            </div>

          </div>

          <div className="col-4">
            <div className='form-group'>
              <label htmlFor='car-name'>Auton nimi</label>
              <input type="text" 
                     className='form-control' 
                     onChange={onCarNameChange}></input>
            </div>                        
          </div>
          <div className="col-2 d-flex align-items-end">
            <button type="submit" className="btn btn-primary" onClick={onCreateCar}>Lisää</button>
          </div>        
        </div>

        <div className='row'>
          <div className="col-6">
            <strong>Ajoneuvot</strong>
          </div>        

          <div className="col-6 text-end">
            Autojen määrä <strong>{driverCars.length}</strong>
          </div>        
        </div>

        <table className="table" onKeyUp={onKeyUp}  ref={tableRef}>
          <thead>
            <tr>
              <th onClick={() => {dispatch(setOrder('name'))}}>
                <div className='d-flex'>
                Nimi
                {state.order === 'name' && (
                  <i className="bi-caret-down" role="img" aria-label="Järjestys"></i>         
                )}
                </div>
              </th>
              <th onClick={() => {dispatch(setOrder('score'))}}>
                <div className='d-flex'>
                Pisteet
                {state.order === 'score' && (
                  <i className="bi-caret-down" role="img" aria-label="Järjestys"></i>         
                )}   
                </div>             
              </th>
            </tr>
          </thead>

          <tbody>
            {carsAlfabetically.map( (car,i) => {

              let previousCarId = car.id;
              let nextCarId = car.id;

              if( i > 0 ) {
                previousCarId = carsAlfabetically[i-1].id;
              } 
              if( i < carsAlfabetically.length-1 ) {
                nextCarId = carsAlfabetically[i+1].id;
              }           
              
              return (<tr key={car.id} 
                          data-previous-id={previousCarId}
                          data-next-id={nextCarId}
                          className="car-table-row">
                {state.car_id === car.id && (
                  <>
                    <td data-car-id={car.id} onClick={onCarClicked} className="">
                      <input type="text" 
                             data-car-id={car.id}
                             name="carname"
                             className='form-control' 
                             defaultValue={car.name} 
                             onFocus={onFocused}
                             onChange={onCarNameChange} />                                                                                             
                    </td>                  
                    <td className='d-flex'>
                      <input type="text" 
                             placeholder='Pisteet' 
                             data-car-id={car.id}                             
                             name="carscore"
                             className='ms-2 form-control' 
                             value={state.carScores} 
                             onFocus={onFocused}
                             onChange={onCarScoresChanges} />
                      <button type="button" className="ms-2 btn btn-primary" onClick={saveCarName}>Tallenna</button>       
                    </td>
                  </>
                )}
                {state.car_id !== car.id && (
                  <>
                    <td data-car-id={car.id} onClick={onCarClicked}>
                      <HighlightedText text={car.name} searchText={filter?.filter ?? ''}></HighlightedText>
                      <i className="bi-brush" role="img" aria-label="GitHub"></i>
                    </td>
                    <td data-car-id={car.id} onClick={onCarClicked}>{car.scores}</td>
                  </>
                )}                
              </tr>);
            })}
          </tbody>
        </table>

        </div>
      })}  
    </section>

  </>
}

