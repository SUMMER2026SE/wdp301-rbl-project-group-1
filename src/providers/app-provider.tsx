import { ReduxProvider } from "./store-provider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
