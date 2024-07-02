import { apiSlice } from "./apiSlice";
import { MESSAGE_URL } from "../constants";

export const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: ({channelId, message}) => ({
        url: `${MESSAGE_URL}/${channelId}/messages`,
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["Message"],
    }),
    editMessage: builder.mutation({
      query: ({ messageId, message }) => ({
        url: `${MESSAGE_URL}/${messageId}`,
        method: "PUT",
        body: message,
      }),
      invalidatesTags: ["Message"],
    }),
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `${MESSAGE_URL}/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Message"],
    }),
    reactToMessage: builder.mutation({
      query: ({ messageId, reaction }) => ({
        url: `${MESSAGE_URL}/${messageId}/react`,
        method: "POST",
        body: { reaction },
      }),
      invalidatesTags: ["Message"],
    }),
    replyToMessage: builder.mutation({
      query: ({ messageId, reply }) => ({
        url: `${MESSAGE_URL}/${messageId}/reply`,
        method: "POST",
        body: reply,
      }),
      invalidatesTags: ["Message", "Reply"]
    }),
    fetchMessages: builder.query({
      query: (channelId) => ({
        url: `${MESSAGE_URL}/${channelId}/messages`,
      }),
      providesTags: ["Message"],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useReactToMessageMutation,
  useReplyToMessageMutation,
  useFetchMessagesQuery,
} = messagesApiSlice;
