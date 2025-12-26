import { createSlice } from '@reduxjs/toolkit'
import type {  ICurrentUser } from '../../type/user.module';
import {  loginGoogleWithInfo, loginWithInfo, refreskToken } from '../thunks/auth.thunk';


// Define the initial state using that type
const initialState:{user : ICurrentUser} = {
  user : {} as ICurrentUser,
 
}

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginWithInfo.fulfilled,(state,action) =>{
      state.user = action.payload;
    })
    .addCase(loginGoogleWithInfo.fulfilled,(state,action) =>{
      state.user = action.payload;
    })
    .addCase(refreskToken.fulfilled,(state,action) =>{
      state.user.accessToken = action.payload.accessToken;
      state.user.user = action.payload.userToken;
    })
  }
})

// eslint-disable-next-line no-empty-pattern
export const { } = authSlice.actions

export default authSlice.reducer