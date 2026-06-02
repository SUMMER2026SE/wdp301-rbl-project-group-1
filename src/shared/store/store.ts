import { authReducer } from "@/src/features/auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./baseApi";

import "@/src/features/auth/authEnhance";
import "@/src/features/user/userEnhance";
import "@/src/features/student/tutors/tutorEnhance";
import "@/src/features/tutor-application/tutorApplicationEnhance";
import "@/src/features/payment/paymentEnhance";
import "@/src/features/schedule/scheduleAvailabilityEnhance";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
