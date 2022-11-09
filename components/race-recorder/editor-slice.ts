import { createSlice, createAsyncThunk, PayloadAction   } from '@reduxjs/toolkit'
import * as api from './race-recorder-api';
import {Track, Driver, Session, Record} from '../../lib/race-recorder/types';
import _ from 'lodash';

export interface RecordValidity {
  isValid?: boolean|null,
  record: Record  
}

interface TrackEditorModalState {
  showTrackEditorModal?: boolean,
  trackEditorModalTrack?: Track|null,
}

export type SessionEditorState = {
  track_id: number|null,

  tracks: Track[],
  drivers: Driver[],

  sessionEditorOpen: boolean, 
  sessionEditorSession: Session|null,        
  sessionEditorTrack: Track|null,

  sessionEditorDriverEditFieldDriver: Driver|null,
  sessionEditorDriverEditField: boolean,
  sessionEditorRecordValidity: RecordValidity[]

  status: string
} & TrackEditorModalState;

export interface TrackSessionPayload {
  trackId: number|null,
  session: Session
}



const initialState:SessionEditorState = {
  track_id: null, 

  tracks: [],
  drivers: [],
  
  sessionEditorOpen: false, 
  sessionEditorSession: null,      
  
  sessionEditorTrack: null,
  
  sessionEditorDriverEditFieldDriver: null,
  sessionEditorDriverEditField: false,
  sessionEditorRecordValidity: [],

  showTrackEditorModal: false,
  trackEditorModalTrack: null,

  status: ''
};

export const fetchTracksAndDrivers = createAsyncThunk(
  'race-recorder/fetchTracksAndDrivers',
  async () => {
    return await Promise.all([
      api.getDrivers(),
      api.getAllTracks(),
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

export const updateSession = createAsyncThunk(
  'race-recorder/updateTrackSession',
  async (payload:TrackSessionPayload) => {
    await api.updateTrackSession(payload);        
    return await api.getAllTracks();
  }
);

export const deleteSession = createAsyncThunk(
  'race-recorder/deleteTrackSession',
  async (payload:Session, thunkAPI) => {
    const respone = await api.deleteTrackSession(payload);            
    thunkAPI.dispatch(fetchTracksAndDrivers())
    return respone;
  }
);

export const addTrack = createAsyncThunk(
  'race-recorder/addTrack',
  async (payload:Track,tuckApi) => {
    const respone = await api.addTrack(payload);
    tuckApi.dispatch(fetchTracksAndDrivers())           
    return respone;
  }
);

export const updateTrack = createAsyncThunk(
  'race-recorder/updateTrack',
  async (payload:Track, tuckApi) => {
    const respone = await api.updateTrack(payload);
    tuckApi.dispatch(fetchTracksAndDrivers())
    return respone;
  }
);

export const updateTrackDrivers = createAsyncThunk(
  'race-recorder/updateTrackDrivers',
  async (payload:Track) => {
    return await api.updateTrackDrivers(payload);        
  }
);

interface SessionEditorModalState {
  sessionEditorOpen: boolean,
  sessionEditorSession: Session,
  sessionEditorTrack: Track,
  sessionEditorDriverEditField?: boolean  
}

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
        sessions: action.payload.trackEditorModalTrack?.sessions ?? []
      };      
      state.showTrackEditorModal = action.payload.showTrackEditorModal;      
      return state;
    },

    setRecordModal: (state, action: PayloadAction<SessionEditorModalState>) => {
      state.sessionEditorOpen = action.payload.sessionEditorOpen;      
      
      const track = action.payload.sessionEditorTrack

      state.sessionEditorTrack = { id: track.id, name: track.name, sessions: [] }

      if( !action.payload.sessionEditorSession ) {
        state.sessionEditorSession = { id: null, time: Date.now(), records: [], tracks_id: track.id, };
        state.sessionEditorTrack.sessions = [...track.sessions, state.sessionEditorSession ];
      } else {
        state.sessionEditorTrack.sessions = [...track.sessions ];

        state.sessionEditorSession = {
          id: action.payload.sessionEditorSession.id,
          time: action.payload.sessionEditorSession.time,
          tracks_id: track.id,
          records: action.payload.sessionEditorSession.records.map( record => ({ ...record }))
        }
      }

      return state;
    },

    sessionEditorRecordValidity: (state, action:PayloadAction<RecordValidity[]>) => {    
      state.sessionEditorRecordValidity = action.payload.map((validity) => ({ 
        isValid: validity.isValid, 
        record: { ...validity.record }
      }));

      return state;
    },

    moveDriverToSessionEditor: (state) => {      
      const session = state.sessionEditorSession;

      session?.records.push({
        id: null,
        time: 0, 
        sessions_id: session?.id,
        drivers_id: state.sessionEditorDriverEditFieldDriver?.id
      });
      
      state.sessionEditorDriverEditFieldDriver = null;      
      return state;
    },

    showRecordModal: (state, action: PayloadAction<boolean>) => {      
      state.sessionEditorOpen = action.payload;
      return state;
    },

    setSessionEditorSession: (state, action:PayloadAction<Session>) => {         
      state.sessionEditorSession = action.payload;  
      if( state.sessionEditorTrack ) {
        state.sessionEditorTrack.sessions = state.sessionEditorTrack.sessions.map( session => {
          return session.id === action.payload.id ? action.payload : session;                  
        });
      }
      return state;
    },    

    setDriverEditFieldDriver: (state, action:PayloadAction<Driver>) => {         
      state.sessionEditorDriverEditFieldDriver = action.payload;          
      return state;
    },

    showDriverEditField: (state, action:PayloadAction<boolean>) => {      
      state.sessionEditorDriverEditField = action.payload;      
      return state;
    }
  },

  extraReducers(builder) {  
    builder
      .addCase(fetchTracksAndDrivers.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTracksAndDrivers.fulfilled, (state, action) => {
        state.status = 'succeeded';        
        const [drivers, tracks] = action.payload;
        state.drivers = drivers;
        state.tracks = tracks;
        state.track_id = state.track_id ?? tracks[0].id;
      })
      .addCase(fetchTracksAndDrivers.rejected, (state, action) => {
        state.status = 'failed';        
      })

      .addCase(updateTrackDrivers.pending, (state, action) => {
        state.status = 'loading';
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
      })
      .addCase(updateTrackDrivers.rejected, (state, action) => {
        state.status = 'failed';  
        return state;      
      })
      .addCase(updateSession.pending, (state, action) => {
        state.status = 'loading';
        return state;
      })
      .addCase(updateSession.fulfilled, (state, action) => {
        state.status = 'succeeded';        
        const tracks = action.payload;        
        state.tracks = tracks;        
        return state;
      })
      .addCase(updateSession.rejected, (state, action) => {
        state.status = 'failed';        
        return state;
      })
      .addCase(deleteSession.pending, (state, action) => {
        state.status = 'loading'; 
        return state;
      })
      .addCase(deleteSession.fulfilled, (state) => {
        state.status = 'succeeded';            
        return state;
      })
      .addCase(deleteSession.rejected, (state, action) => {
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
  showRecordModal,
  setRecordModal,
  showDriverEditField,
  setDriverEditFieldDriver,
  moveDriverToSessionEditor,
  setSessionEditorSession,
  sessionEditorRecordValidity,
  setTrackEditorModal
} = editorSlice.actions;

export default editorSlice.reducer;