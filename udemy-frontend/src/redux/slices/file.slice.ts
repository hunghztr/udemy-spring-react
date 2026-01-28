import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FilesState {
  uploadPercent: Record<string,number>;
}

const initialState: FilesState = {
  uploadPercent: {},
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setUploadPercent: (state, action: PayloadAction<{id:string,percent:number}>) => {
      state.uploadPercent[action.payload.id] = action.payload.percent;
    },
    resetUpload: (state,action) => {
      delete state.uploadPercent[action.payload];
    },
  },

});

export const { setUploadPercent, resetUpload } = filesSlice.actions;
export default filesSlice.reducer;
