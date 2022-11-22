import { createSlice, createAsyncThunk, PayloadAction   } from '@reduxjs/toolkit'
import * as api from '../../lib/race-recorder-api';
import {Track, Driver, Record, Car} from '../../types/types';
import _ from 'lodash';
//import {HistoryState, readHistoryState, pushHistoryState} from './history';

export type FilterDriverState = {
  driver_id?: number,
  filter: string,

}

export type DriverEditorState = {
  driver_id?: number;
  car_id?: number;
  
  status: string,
  
  filters: FilterDriverState[],

  drivers: Driver[],
  cars: Car[],  

  carname: string,  
  carScores: string

  focus: 'carname'|'carscore'|undefined,

  order: 'name'|'score'
};

const initialState:DriverEditorState = {    
  driver_id: undefined,//Active tab
  status: 'loading',
  filters: [],
  drivers: [],
  cars: [], 
  carname: '',
  carScores: '',
  focus:undefined,
  order:'name'
};

export const fetchDriversCars = createAsyncThunk(
  'race-recorder/fetchDriverCars',
  async () => {
    return await Promise.all([
      api.getDrivers(),      
      api.getCars()
    ]);           
  }
)

export const createCar = createAsyncThunk(
  'race-recorder/createCar',
  async (payload:Car,tuckApi) => {
    const respone = await api.createCar(payload);
    tuckApi.dispatch(fetchDriversCars());           
    return respone;
  }
)

export const updateCar = createAsyncThunk(
  'race-recorder/upcateCar',
  async (payload:Car,tuckApi) => {
    const respone = await api.updateCar(payload);
    tuckApi.dispatch(fetchDriversCars())           
    return respone;
  }
)


export const editorSlice = createSlice({
  name: 'drivers',
  initialState,

  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setCarId: (state, action: PayloadAction<number|undefined>) => {
      state.car_id = action.payload;
      return state;
    },    
    setDriverId: (state, action: PayloadAction<number>) => {
      state.driver_id = action.payload;
      return state;
    },
    setFiltersState: (state, action: PayloadAction<FilterDriverState[]>) => {
      state.filters = action.payload.map( payload => ({ ...payload  }));
      return state;
    },
    setCarName: (state, action: PayloadAction<string>) => {
      state.carname = action.payload;
      return state;
    },
    setCarScore: (state, action: PayloadAction<string>) => {
      state.carScores = action.payload;
      return state;
    },
    setFocus: (state, action: PayloadAction<'carname'|'carscore'|undefined>) => {
      state.focus = action.payload;
      return state;
    },
    setOrder: (state, action: PayloadAction<'name'|'score'>) => {
      state.order = action.payload;
      return state;
    },    
  },

  extraReducers(builder) {          
    builder
    .addCase(fetchDriversCars.pending, (state, action) => {
      state.status = 'loading';
      return state;
    })
    .addCase(fetchDriversCars.fulfilled, (state, action) => {
      state.status = 'succeeded';            
      const [drivers, cars] = action.payload;
      state.drivers = drivers ? drivers : [];      
      state.cars = cars ? cars : [];
      if( !state.driver_id && state.drivers?.length > 0 ) {
        state.driver_id = state.drivers[0].id ?? undefined;
      }
      if(drivers && drivers.length > 0) {
        state.filters = drivers.map( driver => {
          return { driver_id: driver.id ?? undefined, filter: ''};
        });
      }
      return state;      
    })
    .addCase(fetchDriversCars.rejected, (state, action) => {
      state.status = 'failed';
      return state;
    });                       

  }  
});

export const { 
  setCarId,
  setDriverId,
  setFiltersState,
  setCarName,
  setCarScore,
  setFocus,
  setOrder
} = editorSlice.actions; 

export default editorSlice.reducer;