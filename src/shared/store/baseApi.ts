import { clearAuth, setAuth } from "@/src/features/auth/authSlice";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const serializeParams = (params: Record<string, unknown>): string => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, String(item)));
    } else {
      search.append(key, String(value));
    }
  }
  return search.toString();
};

const baseQuery = fetchBaseQuery({
  baseUrl: "", // Uses Next.js rewrites to proxy to NEXT_PUBLIC_API_URL
  credentials: "include",
  paramsSerializer: serializeParams,
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
    const currentToken = (
      api.getState() as { auth?: { accessToken?: string | null } }
    ).auth?.accessToken;

    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const performRefresh = async () => {
          const tokenBeforeRefresh = (
            api.getState() as { auth?: { accessToken?: string | null } }
          ).auth?.accessToken;

          // If the token was refreshed by another request in THIS tab while we were waiting
          if (currentToken !== tokenBeforeRefresh) {
            result = await baseQuery(args, api, extraOptions);
            return;
          }

          // Create a new signal so the refresh request isn't aborted if the original query unmounts (React Strict Mode)
          const refreshApi = { ...api, signal: new AbortController().signal };

          let refreshResult = await baseQuery(
            {
              url: "/api/auth/refresh",
              method: "POST",
            },
            refreshApi,
            extraOptions,
          );

          if (refreshResult.error?.status === 409) {
            // A race condition occurred across multiple tabs (the other tab already refreshed the token).
            // Retrying will automatically send the newly updated HttpOnly cookie to the backend.
            refreshResult = await baseQuery(
              {
                url: "/api/auth/refresh",
                method: "POST",
              },
              refreshApi,
              extraOptions,
            );
          }

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
        };

        // Use Web Locks API to coordinate refresh across multiple browser tabs
        if (typeof navigator !== "undefined" && navigator.locks) {
          await navigator.locks.request(
            "edura_refresh_token_lock",
            { mode: "exclusive" },
            async () => {
              await performRefresh();
            },
          );
        } else {
          await performRefresh();
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      // Small grace period to let the winning request's setAuth dispatch
      // propagate through Redux before we retry with the new access token.
      await new Promise((resolve) => setTimeout(resolve, 50));
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Tutor", "TutorApplication", "Booking", "TutorRequest", "Conversation", "Message", "Notification", "Session"],
  endpoints: () => ({}),
});
