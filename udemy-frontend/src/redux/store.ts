import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth.slice'
import uiReducer from './slices/ui.slice'

const rootReducer = combineReducers({
  currentUser: authReducer,
  ui: uiReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

// Types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
