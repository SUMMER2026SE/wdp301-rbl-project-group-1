import { Toaster } from "@/src/shared/components/ui/sonner";
import { ReduxProvider } from "./store-provider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      {children}
      <Toaster />
    </ReduxProvider>
  );
}
