import { createSlice, isPending, isRejected, isFulfilled } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    pendingCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => {
        state.pendingCount++;
      })
      .addMatcher(isFulfilled, (state) => {
        state.pendingCount = Math.max(0, state.pendingCount - 1);
      })
      .addMatcher(isRejected, (state) => {
        state.pendingCount = Math.max(0, state.pendingCount - 1);
      });
  },
});

export default loadingSlice.reducer;
