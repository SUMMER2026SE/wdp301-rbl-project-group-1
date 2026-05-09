import { Toaster } from "@/src/shared/components/ui/sonner";
import AuthProvider from "./auth-provider";
import { ReduxProvider } from "./store-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ReduxProvider>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </ReduxProvider>
    </GoogleOAuthProvider>
  );
}
