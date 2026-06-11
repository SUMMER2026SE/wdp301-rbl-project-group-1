

import { Toaster } from "@/src/shared/components/ui/sonner";
import AuthProvider from "./auth-provider";
import { ReduxProvider } from "./store-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SocketProvider } from "@/src/shared/context/socket-context";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ReduxProvider>
        <AuthProvider>
          <SocketProvider>{children}</SocketProvider>
        </AuthProvider>
        <Toaster />
      </ReduxProvider>
    </GoogleOAuthProvider>
  );
}
