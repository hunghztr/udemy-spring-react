import { createSlice } from '@reduxjs/toolkit'
import {  loginGoogleWithInfo, loginWithInfo, refreskToken, register } from '../thunks/auth.thunk';


// Define the initial state using that type
const initialState:{ isLoading : boolean,error : string|null} = {
  isLoading : false,
  error : null
}

export const uiSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginWithInfo.pending,(state) =>{
      state.isLoading = true;
    }).addCase(loginWithInfo.fulfilled,(state) =>{
      state.isLoading = false;
    })
    .addCase(loginWithInfo.rejected,(state,action) =>{
      state.isLoading = false;
      state.error = action.payload as string;
    })
    .addCase(loginGoogleWithInfo.pending,(state) =>{
      state.isLoading = true;
    })
    .addCase(loginGoogleWithInfo.fulfilled,(state) =>{
      state.isLoading = false;
      state.error = null;
    })
    .addCase(loginGoogleWithInfo.rejected,(state,action)=>{
      state.isLoading = false;
      state.error = action.payload as string;
    })
    .addCase(register.pending,(state)=>{
      state.isLoading = true;
    })
    .addCase(register.rejected,(state,action)=>{
      state.error = action.payload as string;
    })
    .addCase(register.fulfilled,(state) =>{
      state.error = null;
      state.isLoading = false;
    })
    .addCase(refreskToken.pending,(state) =>{
      state.isLoading = true;
    })
    .addCase(refreskToken.fulfilled,(state) =>{
      state.isLoading = false;
      state.error = null;
    })
    .addCase(refreskToken.rejected,(state,action) =>{
      state.isLoading = false;
      state.error = action.payload as string;
    })
  }
})

// eslint-disable-next-line no-empty-pattern
export const { } = uiSlice.actions

export default uiSlice.reducer