"use client";

import "@/src/features/auth/authEnhance";
import { store } from "@/src/shared/store/store";
import { Provider } from "react-redux";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
