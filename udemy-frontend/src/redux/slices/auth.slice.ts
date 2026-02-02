import type { IToken } from '@/type/auth.module';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getMe, loginWithInfo, logOut, refreshToken } from '../thunks/auth.thunk';



// Define the initial state using that type
const initialState: IToken = {
  accessToken : "" as string,
  isAuthenticated: false,
  isInittialized: false
 
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setInitialized: (state,action:PayloadAction<boolean>) =>{
      state.isInittialized = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginWithInfo.fulfilled,(state,action) =>{
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isInittialized = true;
    })
    .addCase(refreshToken.fulfilled,(state,action) =>{
      state.accessToken = action.payload.accessToken;
    })
    .addCase(getMe.rejected,(state) =>{
      state.isAuthenticated = false;
      state.isInittialized = true;
    })
    .addCase(getMe.fulfilled,(state) =>{
        state.isAuthenticated = true;
        state.isInittialized = true;
    })
    .addCase(logOut.fulfilled,(state) =>{
      state.accessToken = "";
      state.isInittialized = true;
      state.isAuthenticated = false;
    })
  }
})

export const {  } = authSlice.actions

export default authSlice.reducer