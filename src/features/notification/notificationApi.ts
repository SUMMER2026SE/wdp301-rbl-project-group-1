import { baseApi } from "@/src/shared/store/baseApi";
import type { NotificationDto, NotificationListResponse } from "./types";

interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface GetNotificationsParams {
  page?: number;
  limit?: number;
}

const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<
      NotificationListResponse,
      GetNotificationsParams | undefined
    >({
      query: (params = { page: 1, limit: 20 }) => ({
        url: "/api/notifications",
        params,
      }),
      providesTags: [{ type: "Notification", id: "LIST" }],
    }),

    getUnreadCount: build.query<number, void>({
      query: () => "/api/notifications/unread-count",
      transformResponse: (response: BaseResponse<number>) => response.data,
      providesTags: [{ type: "Notification", id: "UNREAD_COUNT" }],
    }),

    markNotificationRead: build.mutation<void, string>({
      query: (notificationId) => ({
        url: `/api/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      // Optimistic update: mark as read immediately in cache
      async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
        const patchList = dispatch(
          notificationApi.util.updateQueryData(
            "getNotifications",
            { page: 1, limit: 20 },
            (draft) => {
              const item = draft.data.find((n) => n.id === notificationId);
              if (item) item.isRead = true;
            }
          )
        );
        const patchCount = dispatch(
          notificationApi.util.updateQueryData(
            "getUnreadCount",
            undefined,
            (draft) => Math.max(0, draft - 1)
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchList.undo();
          patchCount.undo();
        }
      },
      invalidatesTags: [{ type: "Notification", id: "UNREAD_COUNT" }],
    }),

    markAllNotificationsRead: build.mutation<void, void>({
      query: () => ({
        url: "/api/notifications/read-all",
        method: "PATCH",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          notificationApi.util.updateQueryData(
            "getNotifications",
            { page: 1, limit: 20 },
            (draft) => {
              draft.data.forEach((n) => (n.isRead = true));
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD_COUNT" },
      ],
    }),

    deleteNotification: build.mutation<void, string>({
      query: (notificationId) => ({
        url: `/api/notifications/${notificationId}`,
        method: "DELETE",
      }),
      async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
        const patchList = dispatch(
          notificationApi.util.updateQueryData(
            "getNotifications",
            { page: 1, limit: 20 },
            (draft) => {
              draft.data = draft.data.filter((n) => n.id !== notificationId);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchList.undo();
        }
      },
      invalidatesTags: ["Notification"],
    }),

    clearAllNotifications: build.mutation<void, void>({
      query: () => ({
        url: "/api/notifications",
        method: "DELETE",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const patchList = dispatch(
          notificationApi.util.updateQueryData(
            "getNotifications",
            { page: 1, limit: 20 },
            (draft) => {
              draft.data = [];
            }
          )
        );
        const patchCount = dispatch(
          notificationApi.util.updateQueryData(
            "getUnreadCount",
            undefined,
            () => 0
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchList.undo();
          patchCount.undo();
        }
      },
      invalidatesTags: ["Notification"],
    }),
  }),
  overrideExisting: false,
});

export { notificationApi };

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
} = notificationApi;
