import { createSlice } from '@reduxjs/toolkit'
import type { IUserToken } from '../../type/auth.module';
import {  loginWithInfo, logOut, refreshToken } from '../thunks/auth.thunk';


// Define the initial state using that type
const initialState: IUserToken = {
  id : "" as string,
  username: "" as string,
  fullname: "" as string,
  roleName: "" as string,
  avatarPath: "" as string,
  description: "" as string,
}

const mapActionToState = (state : IUserToken,action : {payload : {user : IUserToken}}) =>{
    const user = action.payload.user;
      state.id = user.id;
      state.fullname = user.fullname;
      state.avatarPath = user.avatarPath;
      state.username = user.username;
      state.roleName = user.roleName;
      state.description = user.description;
}
export const userSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginWithInfo.fulfilled,mapActionToState)
    .addCase(refreshToken.fulfilled,mapActionToState)
    .addCase(logOut.fulfilled,mapActionToState)
  }
})

// eslint-disable-next-line no-empty-pattern
export const { } = userSlice.actions

export default userSlice.reducer