import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import loadingReducer from './slices/loading.slice'
import authReducer from './slices/auth.slice'
import currentUserReducer from './slices/current.user.slice'
import errorReducer from './slices/error.slice'
import fileReducer from './slices/file.slice'
import notificationReducer from './slices/notification.slice'
const userPersistConfig = {
  key: 'currentUser',
  storage,
  whitelist: ['id', 'username', 'fullname', 'roleName', 'avatarPath'],
}

const rootReducer = combineReducers({
  auth: authReducer,
  currentUser: persistReducer(userPersistConfig, currentUserReducer),
  loading: loadingReducer,
  error: errorReducer,
  fileProgress: fileReducer,
  notifications: notificationReducer
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
