import { createSlice, createAsyncThunk, PayloadAction   } from '@reduxjs/toolkit'
import * as api from '../../lib/race-recorder-api';
import {Track, Driver, Record, Car} from '../../types/types';
import _ from 'lodash';
import {HistoryState, readHistoryState, pushHistoryState} from './history';

export interface RecordValidity {
  isValid?: boolean|null,
  record: Record  
}

interface TrackEditorModalState {
  showTrackEditorModal?: boolean,
  trackEditorModalTrack: Track|null,
}

export type RecordEditorState = {
  track_id?: number,

  tracks: Track[],
  drivers: Driver[],
  cars: Car[],

  status: string,

  time: string,
  driver_id?: number,  
  car_id?: number,
  
  showConfirmDialog: boolean,

  //Targeted record's id number
  record_id?: number;

  modify_record_id?: number;

  historyState: HistoryState,

} & TrackEditorModalState;

const initialState:RecordEditorState = {
  track_id: undefined, 

  tracks: [],
  drivers: [],
  cars: [],

  showTrackEditorModal: false,
  trackEditorModalTrack: null,
  showConfirmDialog: false,

  time: '',
  status: '', 

  record_id: undefined,

  modify_record_id: undefined,

  historyState:  {} 
};

export const fetchTracksDriversCars = createAsyncThunk(
  'race-recorder/fetchTracksDriversCars',
  async () => {
    return await Promise.all([
      api.getDrivers(),
      api.getAllTracks(),
      api.getCars()
    ]);           
  }
)

export const fetchCars = createAsyncThunk(
  'race-recorder/fetchCars',
  async () => {
    return await api.getCars();
  }
)


export const fetchDrivers = createAsyncThunk(
  'race-recorder/fetchDriver',
  async () => {
    return await api.getDrivers();    
  }
);

export const fetchTracks = createAsyncThunk(
  'race-recorder/fetchTracks',
  async () => {
    return await api.getAllTracks();        
  }
);

export const createRecord = createAsyncThunk(
  'race-recorder/createRecord',
  async (payload:Record,tuckApi) => {
    const respone = await api.createRecord(payload);
    tuckApi.dispatch(fetchTracksDriversCars())           
    return respone;
  }
)

export const updateRecord = createAsyncThunk(
  'race-recorder/updateRecord',
  async (payload:Record,tuckApi) => {
    const respone = await api.updateRecord(payload);
    tuckApi.dispatch(fetchTracksDriversCars())           
    return respone;
  }
)

export const deleteRecord = createAsyncThunk(
  'race-recorder/deleteRecord',
  async (payload:Record,tuckApi) => {
    const respone = await api.deleteRecord(payload);
    tuckApi.dispatch(fetchTracksDriversCars())           
    return respone;
  }
)

export const addTrack = createAsyncThunk(
  'race-recorder/addTrack',
  async (payload:Track,tuckApi) => {
    const respone = await api.addTrack(payload);
    tuckApi.dispatch(fetchTracksDriversCars())           
    return respone;
  }
);

export const updateTrack = createAsyncThunk(
  'race-recorder/updateTrack',
  async (payload:Track, tuckApi) => {
    const respone = await api.updateTrack(payload);
    tuckApi.dispatch(fetchTracksDriversCars())
    return respone;
  }
);

export const updateTrackDrivers = createAsyncThunk(
  'race-recorder/updateTrackDrivers',
  async (payload:Track) => {
    return await api.updateTrackDrivers(payload);        
  }
);

export const editorSlice = createSlice({
  name: 'raceeditor',
  initialState,

  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {

    updateStateFromHistory: (state, action: PayloadAction<HistoryState>) => {
      state.track_id = action.payload.track_id;
      state.modify_record_id = action.payload.modify_record_id;
      state.time = action.payload.time ?? '';
      state.car_id = action.payload.cars_id;
      state.driver_id = action.payload.drivers_id;  
    },

    updateHistoryState: (state, action: PayloadAction<HistoryState>) => {
      pushHistoryState(action.payload);
      state.historyState = {
        ...action.payload
      }        
      return state;     
    },

    changeTrack: (state, action: PayloadAction<number>) => {      
      state.track_id = action.payload; 
      state.modify_record_id = undefined;  
      return state;
    },

    setTrackEditorModal: (state, action: PayloadAction<TrackEditorModalState>) => {      
      state.trackEditorModalTrack = { 
        id: action.payload.trackEditorModalTrack?.id ?? null,
        name: action.payload.trackEditorModalTrack?.name ?? '',
        description: '',
        records: []
      };      
      state.showTrackEditorModal = action.payload.showTrackEditorModal;      
      return state;
    },

    setDriverId: (state, action: PayloadAction<number|undefined>) => {      
      state.driver_id = action.payload;
      return state;
    },

    setCarId: (state, action: PayloadAction<number|undefined>) => {      
      state.car_id = action.payload;
      return state;
    },

    setTime: (state, action: PayloadAction<string>) => {
      state.time = action.payload;
      return state;
    },
    
    setRecordId: (state, action: PayloadAction<number|undefined>) => {
      state.record_id = action.payload;
      return state;
    },

    setModifyRecordId: (state, action: PayloadAction<number|undefined>) => {
      state.modify_record_id = action.payload;
      return state;
    },    

    setShowConfirmDialog(state, action: PayloadAction<boolean>) {
      state.showConfirmDialog = action.payload;    
      return state;
    },
  },

  extraReducers(builder) {  
    
    builder
      .addCase(fetchTracksDriversCars.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTracksDriversCars.fulfilled, (state, action) => {
        state.status = 'succeeded';        
        const [drivers, tracks, cars] = action.payload;
        state.drivers = drivers ? drivers : [];
        state.tracks = tracks ? tracks : [];
        state.cars = cars ? cars : [];
        
        if( state.track_id ) {
          state.track_id = state.track_id;
        } else if( state.tracks?.length > 0 ) {
          state.track_id = state.tracks[0].id ?? undefined;
        }

        return state;
      })
      .addCase(fetchTracksDriversCars.rejected, (state, action) => {
        state.status = 'failed';        
        console.log(action)
        return state;
      })

      .addCase(updateTrackDrivers.pending, (state, action) => {
        state.status = 'loading';
        return state;
      })
      .addCase(updateTrackDrivers.fulfilled, (state, action) => {
        state.status = 'succeeded';        
        const updatedTrack = action.payload;
        
        state.tracks = state.tracks.map( track => {
          if( track.id === updatedTrack.id ) {
            return { ...track, ...updateTrackDrivers };
          }
          return track;
        });           
        
        return state;
      })
      .addCase(updateTrackDrivers.rejected, (state, action) => {
        state.status = 'failed';  
        return state;      
      })
      .addCase(addTrack.pending, (state) => {
        state.status = 'loading'; 
        return state;
      })
      .addCase(addTrack.fulfilled, (state, action) => {
        state.status = 'succeeded';     
        state.track_id = action.payload.id ?? undefined;       
        state.showTrackEditorModal = false;
        return state;
      })
      .addCase(addTrack.rejected, (state) => {
        state.status = 'failed';        
        return state;
      })

      .addCase(updateTrack.pending, (state) => {
        state.status = 'loading';        
        return state;
      })
      .addCase(updateTrack.fulfilled, (state, action) => { 
        state.status = 'succeeded';
        state.track_id = action.payload.id ?? undefined;         
        state.showTrackEditorModal = false;                
        return state;
      })
      .addCase(updateTrack.rejected, (state) => {
        state.status = 'failed';        
        return state;
      })

      .addCase(createRecord.pending, (state) => {
        state.status = 'loading';        
        return state;
      })
      .addCase(createRecord.fulfilled, (state, action) => { 
        state.status = 'succeeded';
        state.time = '';
        state.driver_id = undefined;
        state.car_id = undefined;
        state.record_id = undefined;
        state.modify_record_id = undefined;        
        return state;
      })
      .addCase(createRecord.rejected, (state) => {
        state.status = 'failed';        
        return state;
      })

      .addCase(deleteRecord.pending, (state, action) => {
        state.status = 'pending';
        return state;
      })

      .addCase(deleteRecord.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.record_id = undefined;
        return state;
      })

      .addCase(deleteRecord.rejected, (state, action) => {        
        state.status = 'failed';
        return state;
      })
      
      .addCase(updateRecord.pending, (state, action) => {
        state.status = 'pending';
        return state;
      })

      .addCase(updateRecord.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.time = '';
        state.driver_id = undefined;
        state.car_id = undefined;
        state.record_id = undefined;
        state.modify_record_id = undefined;
        return state;
      })

      .addCase(updateRecord.rejected, (state, action) => {        
        state.status = 'failed';
        return state;
      })

      .addCase(fetchCars.pending, (state, action) => {
        state.status = 'pending';
        return state;
      })

      .addCase(fetchCars.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cars = action.payload ? action.payload : [];
        return state;
      })

      .addCase(fetchCars.rejected, (state, action) => {        
        state.status = 'failed';
        return state;
      });         
  }  
});

export const { 
  changeTrack, 
  setTrackEditorModal,
  setDriverId,
  setCarId,
  setTime,
  setShowConfirmDialog,
  setRecordId,
  setModifyRecordId,
  updateHistoryState,
  updateStateFromHistory
} = editorSlice.actions; 

export default editorSlice.reducer;