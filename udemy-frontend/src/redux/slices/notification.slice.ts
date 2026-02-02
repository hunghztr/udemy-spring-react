import type { INotificationResponse, NotificationSlice } from "@/type/notification.module";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getNotifications, markNotification } from "../thunks/notification.thunk";


const initialState: NotificationSlice = {
  items: [],
  hasNext: true,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<INotificationResponse>) => {
      if(state.items.length === 10) state.hasNext = true;
      state.items.unshift(action.payload);
    },
    resetNotifications: (state) => {
      state.items = [];
      state.hasNext = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.items.push(...action.payload.items);
        state.hasNext = action.payload.hasNext;
      })
      .addCase(markNotification.fulfilled,(state,action) =>{
        state.items = state.items.map(i => i.id === action.payload ? {...i,read:true} : i)
      })
 
  },
});
export const {addNotification  } = notificationSlice.actions

export default notificationSlice.reducer