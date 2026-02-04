import type { INotificationResponse, NotificationSlice } from "@/type/notification.module";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { countNew, deleteNotification, getNotifications, markNotification } from "../thunks/notification.thunk";
import { logOut } from "../thunks/auth.thunk";


const initialState: NotificationSlice = {
  items: [],
  hasNext: true,
  unRead: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<INotificationResponse>) => {
      state.items.unshift(action.payload);
      if(!action.payload.read)
        state.unRead++;
    },
    resetNotifications: (state) => {
      state.items = [];
      state.hasNext = true;
      state.unRead = 0;
    },
    getDefault:(state) =>{
      state.items = state.items.slice(0,10);
      state.hasNext = true;
      state.unRead = state.items.filter(n => !n.read).length;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.fulfilled, (state, action) => {
        const incoming = action.payload.items;
        const beforeLength = state.items.length;

        if (beforeLength === 0) {
          state.items = incoming;
        } else {
          const existingIds = new Set(state.items.map(i => i.id));
          state.items.push(...incoming.filter(i => !existingIds.has(i.id)));
        }

        const afterLength = state.items.length;
        if (afterLength > beforeLength) {
          state.hasNext = action.payload.hasNext;
        }
      })
      .addCase(markNotification.fulfilled,(state,action) =>{
        state.items = state.items.map(i => i.id === action.payload ? {...i,read:true} : i)
        state.unRead = state.items.filter(n => !n.read).length;
      })
      .addCase(countNew.fulfilled,(state,action) =>{
        state.unRead = action.payload;
      })
      .addCase(deleteNotification.fulfilled,(state,action) =>{
        state.items = state.items.filter(n => n.id !== action.payload)
        state.unRead = state.items.filter(n => !n.read).length;
      })
      .addCase(logOut.fulfilled,(state) =>{
        state.items = [];
        state.hasNext = true;
        state.unRead = 0;
      })
      
 
  },
});
export const {addNotification,resetNotifications,getDefault  } = notificationSlice.actions

export default notificationSlice.reducer