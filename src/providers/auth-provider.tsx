"use client";

import { authApi } from "@/src/features/auth/authApi";
import { setAuthInitialized } from "@/src/features/auth/authSlice";
import { useAppDispatch } from "@/src/shared/store/hooks";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(
          authApi.endpoints.getMe.initiate(undefined, {
            subscribe: false,
          }),
        ).unwrap();
        dispatch(setAuthInitialized());
      } catch {
        dispatch(setAuthInitialized());
      }
    };

    initAuth();
  }, [dispatch]);

  return children;
}
