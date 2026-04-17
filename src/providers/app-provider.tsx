import { Toaster } from "@/src/shared/components/ui/sonner";
import AuthProvider from "./auth-provider";
import { ReduxProvider } from "./store-provider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AuthProvider>{children}</AuthProvider>
      <Toaster />
    </ReduxProvider>
  );
}
