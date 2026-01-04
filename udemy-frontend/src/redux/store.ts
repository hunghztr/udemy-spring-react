import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import authReducer from './slices/auth.slice'
import uiReducer from './slices/ui.slice'
import userReducer from './slices/user.slice'

const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['id', 'username', 'fullname', 'roleName', 'avatarPath'],
}

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  user: persistReducer(userPersistConfig, userReducer),
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)

// Types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
