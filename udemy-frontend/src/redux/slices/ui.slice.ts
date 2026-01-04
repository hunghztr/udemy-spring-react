import { createSlice } from '@reduxjs/toolkit'
import {  changePassword, loginWithInfo, logOut, refreshToken, register, verifyMail, verifyOtp } from '../thunks/auth.thunk';
import type { Error } from '../../type/api.response';


// Define the initial state using that type
const initialState:{ isLoading : boolean,errors : Error
  } = {
  isLoading : false,
  errors : {
    loginError : null,
    registerError: null,
    mailError : null,
    refreshError : null,
    logOutError : null,
    otpError : null,
    changePassError : null
  }
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
      state.errors.loginError = action.payload as string;
    }) 
    .addCase(register.pending,(state)=>{
      state.isLoading = true;
    })
    .addCase(register.rejected,(state,action)=>{
      state.isLoading = false;
      state.errors.registerError = action.payload as string;
    })
    .addCase(register.fulfilled,(state) =>{
      state.errors.registerError = null;
      state.isLoading = false;
    })
    .addCase(refreshToken.pending,(state) =>{
      state.isLoading = true;
    })
    .addCase(refreshToken.fulfilled,(state) =>{
      state.isLoading = false;
      state.errors.refreshError = null;
    })
    .addCase(refreshToken.rejected,(state,action) =>{
      state.isLoading = false;
      state.errors.refreshError = action.payload as string;
    })
    .addCase(logOut.pending,(state) =>{
      state.isLoading = true;
    })
    .addCase(logOut.fulfilled,(state) =>{
      state.isLoading = false;
      state.errors.logOutError = null;
    })
    .addCase(logOut.rejected,(state,action) =>{
      state.isLoading = false;
      state.errors.logOutError = action.payload as string;
    })
    .addCase(verifyMail.pending,(state) => {
      state.isLoading = true;
    })
    .addCase(verifyMail.fulfilled,(state) =>{
      state.isLoading = false;
      state.errors.mailError = null;
    })
    .addCase(verifyMail.rejected,(state,action) =>{
      state.isLoading = false;
      state.errors.mailError = action.payload as string;
    })
    .addCase(verifyOtp.pending,(state) =>{
      state.isLoading = true;
    })
    .addCase(verifyOtp.rejected,(state,action) =>{
      state.isLoading = false;
      state.errors.otpError = action.payload as string;
    })
    .addCase(verifyOtp.fulfilled,(state) =>{
      state.isLoading = false;
      state.errors.otpError = null;
    })
    .addCase(changePassword.pending,(state) =>{
      state.isLoading = true;
    })
    .addCase(changePassword.fulfilled,(state) =>{
      state.isLoading = false;
      state.errors.changePassError = null;
      localStorage.clear();
    })
    .addCase(changePassword.rejected,(state,action) =>{
      state.isLoading = false;
      state.errors.changePassError = action.payload as string;
    })

  }
})

// eslint-disable-next-line no-empty-pattern
export const { } = uiSlice.actions

export default uiSlice.reducer