"use client";

import { authApi } from "@/src/features/auth/authApi";
import { setAuth } from "@/src/features/auth/authSlice";
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
        const refreshResult = await dispatch(
          authApi.endpoints.refresh.initiate(),
        ).unwrap();

        dispatch(setAuth({ accessToken: refreshResult.data.accessToken }));

        dispatch(
          authApi.endpoints.getMe.initiate(undefined, {
            subscribe: false,
          }),
        );
      } catch {
        // chưa login
      }
    };

    initAuth();
  }, [dispatch]);

  return children;
}
