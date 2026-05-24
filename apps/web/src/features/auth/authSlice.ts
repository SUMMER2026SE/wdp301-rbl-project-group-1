import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  isAuthenticated: boolean;
  accessToken: string | null;
  isInitializing: boolean;
};

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  isInitializing: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{ accessToken: string }>,
    ) {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.isInitializing = false;
    },
    clearAuth(state) {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.isInitializing = false;
    },
    setAuthInitialized(state) {
      state.isInitializing = false;
    },
  },
});

export const { setAuth, clearAuth, setAuthInitialized } = authSlice.actions;
export const authReducer = authSlice.reducer;
