import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FilesState {
  uploadPercent: number;
}

const initialState: FilesState = {
  uploadPercent: 0,
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setUploadPercent: (state, action: PayloadAction<number>) => {
      state.uploadPercent = action.payload;
    },
    resetUpload: (state) => {
      state.uploadPercent = 0;
    },
  },

});

export const { setUploadPercent, resetUpload } = filesSlice.actions;
export default filesSlice.reducer;
