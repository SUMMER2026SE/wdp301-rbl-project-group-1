import { clearAuth, setAuth } from "@/src/features/auth/authSlice";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (
      getState() as { auth?: { accessToken?: string | null } }
    ).auth?.accessToken;

    if (accessToken && !headers.has("authorization")) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

const handleAuthFailure = (api: { dispatch: (action: unknown) => unknown }) => {
  api.dispatch(clearAuth());
  api.dispatch(baseApi.util.resetApiState());

  if (typeof window !== "undefined") {
    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
  }
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  const requestUrl = typeof args === "string" ? args : (args as FetchArgs).url;
  const isRefreshCall = requestUrl?.includes("/api/auth/refresh") ?? false;

  if (result.error?.status === 401 && !isRefreshCall) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          {
            url: "/api/auth/refresh",
            method: "POST",
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          const refreshedAccessToken = (
            refreshResult.data as { data?: { accessToken?: string } }
          ).data?.accessToken;

          if (refreshedAccessToken) {
            api.dispatch(setAuth({ accessToken: refreshedAccessToken }));
          }

          api.dispatch(baseApi.util.invalidateTags(["User"]));

          result = await baseQuery(args, api, extraOptions);
        } else {
          handleAuthFailure(api);
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "TutorApplication"],
  endpoints: () => ({}),
});
