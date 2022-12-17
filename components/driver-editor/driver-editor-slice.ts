import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as api from '../../lib/race-recorder-api'
import { Driver, Car } from '../../types/types'

/**
 * UI has a filtering functionality. Driver's cars can be filtered.
 * Each driver has own tab and each driver has own filter.
 */
export interface FilterDriverState {
  /**
   * Driver's id
   */
  driver_id?: number

  /**
   * Filter used filter driver's cars
   */
  filter: string
}

/**
 * DriveEditorState defines a state for DriverEditor
 */
export interface DriverEditorState {
  /**
   * Selected tab / A selected driver's id.
   */
  driver_id?: number

  /**
   * Car's id that is currently being modified. If value is undefined there is no any car beign modifed.
   */
  car_id?: number

  /**
   * Ajax request loading status
   *
   * States are:
   *  - loading - Ajax request is currently making an request
   *  - failed - Request time out or returned HTTP request with a 400 or 500 status code
   *  - succeeded - Request returned with a HTTP status code 200
   */
  status: 'failed' | 'succeeded' | 'loading'

  /**
   * Filters for each driver
   */
  filters: FilterDriverState[]

  /**
   * All drivers
   */
  drivers: Driver[]

  /**
   * All cars
   */
  cars: Car[]

  /**
   * Currently modified car's name
   */
  carname: string

  /**
   * Currently modified cars performance index scores. For clear definition of the performance index can be
   * found from performance-index.ts.
   */
  carScores: string

  /**
   * This value defines is ConfirmDialog shown. If value is true dialog is shown and if value false dialog is hidden.
   */
  showConfirmDialog: boolean

  /**
   * Focus can be in one car at once and a car has two values car's name or car's score.
   * It one of those. Notice that this works with the car car_id property, only one can be focused at the time.
   */
  focus: 'carname' | 'carscore' | undefined

  /**
   * Only on column can be ordered at the time.. small limitation for now.
   */
  order: 'name' | 'score'
}

const initialState: DriverEditorState = {
  driver_id: undefined,
  status: 'loading',
  filters: [],
  drivers: [],
  cars: [],
  carname: '',
  carScores: '',
  focus: undefined,
  order: 'name',
  showConfirmDialog: false
}

export const fetchDriversCars = createAsyncThunk('race-recorder/fetchDriverCars', async () => {
  return await Promise.all([api.getDrivers(), api.getCars()])
})

export const createCar = createAsyncThunk('race-recorder/createCar', async (payload: Car, tuckApi) => {
  const response = await api.createCar(payload)
  await tuckApi.dispatch(fetchDriversCars())
  return response
})

export const updateCar = createAsyncThunk('race-recorder/upcateCar', async (payload: Car, tuckApi) => {
  const respone = await api.updateCar(payload)
  await tuckApi.dispatch(fetchDriversCars())
  return respone
})

export const deleteCar = createAsyncThunk('race-recorder/deleteCar', async (payload: Car, tuckApi) => {
  const response = await api.deleteCar(payload)
  await tuckApi.dispatch(fetchDriversCars())
  return response
})

export const editorSlice = createSlice({
  name: 'drivers',
  initialState,

  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setCarId: (state, action: PayloadAction<number | undefined>) => {
      state.car_id = action.payload
      return state
    },
    setDriverId: (state, action: PayloadAction<number>) => {
      state.driver_id = action.payload
      return state
    },
    setFiltersState: (state, action: PayloadAction<FilterDriverState[]>) => {
      state.filters = action.payload.map(payload => ({ ...payload }))
      return state
    },
    setCarName: (state, action: PayloadAction<string>) => {
      state.carname = action.payload
      return state
    },
    setCarScore: (state, action: PayloadAction<string>) => {
      state.carScores = action.payload
      return state
    },
    setFocus: (state, action: PayloadAction<'carname' | 'carscore' | undefined>) => {
      state.focus = action.payload
      return state
    },
    setOrder: (state, action: PayloadAction<'name' | 'score'>) => {
      state.order = action.payload
      return state
    },
    setShowConfirmDialog: (state, action: PayloadAction<boolean>) => {
      state.showConfirmDialog = action.payload
      return state
    }
  },

  extraReducers(builder) {
    builder
      .addCase(fetchDriversCars.pending, (state, action) => {
        state.status = 'loading'
        return state
      })
      .addCase(fetchDriversCars.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const [drivers, cars] = action.payload
        state.drivers = drivers?.length > 0 ? drivers : []
        state.cars = cars?.length > 0 ? cars : []
        if (!state.driver_id && state.drivers?.length > 0) {
          state.driver_id = state.drivers[0].id ?? undefined
        }
        if (drivers?.length > 0) {
          state.filters = drivers.map(driver => {
            const filter = state.filters.find(filter => filter.driver_id === driver.id)
            return {
              driver_id: driver.id ?? undefined,
              filter: filter?.filter ?? ''
            }
          })
        }
        return state
      })
      .addCase(fetchDriversCars.rejected, (state, action) => {
        state.status = 'failed'
        return state
      })
      .addCase(createCar.pending, (state, action) => {
        state.status = 'loading'
        return state
      })
      .addCase(createCar.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.car_id = action.payload.id ?? undefined
        state.focus = 'carscore'
        state.carname = action.payload.name
        return state
      })
      .addCase(createCar.rejected, (state, action) => {
        state.status = 'failed'
        return state
      })
  }
})

export const {
  setCarId,
  setDriverId,
  setFiltersState,
  setCarName,
  setCarScore,
  setFocus,
  setOrder,
  setShowConfirmDialog
} = editorSlice.actions

export default editorSlice.reducer
