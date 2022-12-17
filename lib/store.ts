import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import recordEditorReducer from '../components/race-recorder/race-recorder-slice'
import driversReducer from '../components/driver-editor/driver-editor-slice'

const store = configureStore({
  reducer: {
    raceeditor: recordEditorReducer,
    drivers: driversReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
