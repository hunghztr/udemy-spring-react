import {
  createSlice,
  isRejected,
  isPending,
  isFulfilled,
} from "@reduxjs/toolkit";

export interface GlobalErrorState {
  errors: Record<string, string | null>;
}

const initialState: GlobalErrorState = {
  errors: {},
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    clearError: (state, action) => {
      delete state.errors[action.payload];
    },

    clearAllErrors: (state) => {
      state.errors = {};
    },
  },
  extraReducers: (builder) => {
    builder

      .addMatcher(isRejected, (state, action) => {
        const key = action.type.replace("/rejected", "");
        state.errors[key] =
          (action.payload as string) ||
          action.error?.message ||
          "Có lỗi xảy ra";
      })

      .addMatcher(isPending, (state, action) => {
        const key = action.type.replace("/pending", "");
        delete state.errors[key];
      })

      .addMatcher(isFulfilled, (state, action) => {
        const key = action.type.replace("/fulfilled", "");
        delete state.errors[key];
      });
  },
});

export const { clearError, clearAllErrors } = errorSlice.actions;
export default errorSlice.reducer;
