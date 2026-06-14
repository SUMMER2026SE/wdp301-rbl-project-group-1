import { baseApi } from "@/src/shared/store/baseApi";
import {
  ConversationResponseDto,
  MessageResponseDto,
  CreateConversationDto,
  MarkReadDto,
  GetMessagesParams,
} from "./types";

// Base API response interface used in the project
interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface QueryResponse<T> extends BaseResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const injectedRtkApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getConversations: build.query<ConversationResponseDto[], void>({
      query: () => ({ url: `/api/conversations` }),
      transformResponse: (response: BaseResponse<ConversationResponseDto[]>) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Conversation" as const, id })),
              { type: "Conversation", id: "LIST" },
            ]
          : [{ type: "Conversation", id: "LIST" }],
    }),
    getConversationMessages: build.query<
      QueryResponse<MessageResponseDto>,
      GetMessagesParams
    >({
      query: ({ conversationId, page = 1, limit = 50 }) => ({
        url: `/api/conversations/${conversationId}/messages`,
        params: { page, limit },
      }),
      providesTags: (result, error, arg) => [
        { type: "Message", id: `LIST-${arg.conversationId}` },
      ],
    }),
    createConversation: build.mutation<
      ConversationResponseDto,
      CreateConversationDto
    >({
      query: (body) => ({
        url: `/api/conversations`,
        method: "POST",
        body,
      }),
      transformResponse: (response: BaseResponse<ConversationResponseDto>) =>
        response.data,
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),
    sendMessage: build.mutation<
      MessageResponseDto,
      { conversationId: string; content: string; type?: string }
    >({
      query: ({ conversationId, content, type = "TEXT" }) => ({
        url: `/api/conversations/${conversationId}/messages`,
        method: "POST",
        body: { conversationId, content, type },
      }),
      transformResponse: (response: BaseResponse<MessageResponseDto>) =>
        response.data,
      async onQueryStarted({ conversationId, content, type }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const patchResult = dispatch(
          injectedRtkApi.util.updateQueryData(
            "getConversationMessages",
            { conversationId, page: 1, limit: 50 },
            (draft) => {
              draft.data.unshift({
                id: tempId,
                conversationId,
                senderId: "me", // We will fix this in UI by checking if isOwn
                content,
                type: type || "TEXT",
                createdAt: new Date().toISOString(),
                isDeleted: false,
                fileUrl: null,
                replyToId: null,
                sender: {
                  id: "me",
                  nickname: "Tôi",
                  avatarUrl: null
                }
              });
            }
          )
        );
        try {
          const { data: realMsg } = await queryFulfilled;
          dispatch(
            injectedRtkApi.util.updateQueryData(
              "getConversationMessages",
              { conversationId, page: 1, limit: 50 },
              (draft) => {
                const tempIndex = draft.data.findIndex((m) => m.id === tempId);
                const realIndex = draft.data.findIndex((m) => m.id === realMsg.id);

                if (tempIndex !== -1) {
                  if (realIndex !== -1 && tempIndex !== realIndex) {
                    // WebSocket already inserted the real message, remove the temp one
                    draft.data.splice(tempIndex, 1);
                  } else {
                    // Replace temp with real
                    draft.data[tempIndex] = realMsg;
                  }
                } else if (realIndex === -1) {
                  // Just in case neither exists
                  draft.data.unshift(realMsg);
                }
              }
            )
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    markAsRead: build.mutation<
      void,
      { conversationId: string; body: MarkReadDto }
    >({
      query: ({ conversationId, body }) => ({
        url: `/api/conversations/${conversationId}/read`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Conversation", id: arg.conversationId },
      ],
    }),
    deleteMessage: build.mutation<void, { messageId: string }>({
      query: ({ messageId }) => ({
        url: `/api/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Message"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useCreateConversationMutation,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useDeleteMessageMutation,
} = injectedRtkApi;

export { injectedRtkApi as chatApi };
