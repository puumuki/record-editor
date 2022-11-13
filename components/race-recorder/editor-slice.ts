import { createSlice, createAsyncThunk, PayloadAction   } from '@reduxjs/toolkit'
import * as api from './race-recorder-api';
import {Track, Driver, Record, Car} from '../../lib/race-recorder/types';
import _ from 'lodash';

export interface RecordValidity {
  isValid?: boolean|null,
  record: Record  
}

interface TrackEditorModalState {
  showTrackEditorModal?: boolean,
  trackEditorModalTrack?: Track|null,
}

export type RecordEditorState = {
  track_id?: number,

  tracks: Track[],
  drivers: Driver[],
  cars: Car[],

  status: string
  
} & TrackEditorModalState;

const initialState:RecordEditorState = {
  track_id: undefined, 

  tracks: [],
  drivers: [],
  cars: [],

  showTrackEditorModal: false,
  trackEditorModalTrack: null,

  status: ''
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
  name: 'editor',
  initialState,

  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    changeTrack: (state, action: PayloadAction<number>) => {      
      state.track_id = action.payload;      
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
  },

  extraReducers(builder) {  
    
    
    builder
      .addCase(fetchTracksDriversCars.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTracksDriversCars.fulfilled, (state, action) => {
        state.status = 'succeeded';        
        const [drivers, tracks, cars] = action.payload;
        state.drivers = drivers;
        state.tracks = tracks;
        state.cars = cars;
        state.track_id = state.track_id ? state.track_id : state.tracks[0].id ?? undefined;
        return state;
      })
      .addCase(fetchTracksDriversCars.rejected, (state, action) => {
        state.status = 'failed';        
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
        state.track_id = action.payload.id;       
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
        state.track_id = action.payload.id;         
        state.showTrackEditorModal = false;        
        return state;
      })
      .addCase(updateTrack.rejected, (state) => {
        state.status = 'failed';        
        return state;
      });
      
  }  
});

export const { 
  changeTrack, 
  setTrackEditorModal
} = editorSlice.actions; 

export default editorSlice.reducer;