import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthUser = {
  id: number;
  email: string;
  role?: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>,
    ) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearAuth(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
