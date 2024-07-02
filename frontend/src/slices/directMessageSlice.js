import { apiSlice } from './apiSlice';
import { DIRECT_MESSAGES_URL } from '../constants';

export const directMessagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendDirectMessage: builder.mutation({
      query: (directMessage) => ({
        url: DIRECT_MESSAGES_URL,
        method: 'POST',
        body: { ...directMessage },
      }),
      invalidatesTags: ['DirectMessage'],
    }),
    getDirectMessages: builder.query({
      query: (recipientId) => ({
        url: `${DIRECT_MESSAGES_URL}/user/${recipientId}`,
      }),
      providesTags: ['DirectMessage'],
    }),
    editDirectMessage: builder.mutation({
      query: ({ messageId, content }) => ({
        url: `${DIRECT_MESSAGES_URL}/${messageId}`,
        method: 'PUT',
        body: { content },
      }),
      invalidatesTags: ['DirectMessage'],
    }),
    deleteDirectMessage: builder.mutation({
      query: (messageId) => ({
        url: `${DIRECT_MESSAGES_URL}/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DirectMessage'],
    }),
    reactToDirectMessage: builder.mutation({
      query: ({ messageId, reaction }) => ({
        url: `${DIRECT_MESSAGES_URL}/${messageId}/react`,
        method: 'POST',
        body: { reaction },
      }),
      invalidatesTags: ['DirectMessage'],
    }),
    replyToDirectMessage: builder.mutation({
      query: ({ messageId, content }) => ({
        url: `${DIRECT_MESSAGES_URL}/${messageId}/reply`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['DirectMessage'],
    }),
  }),
});

export const {
  useSendDirectMessageMutation,
  useGetDirectMessagesQuery,
  useEditDirectMessageMutation,
  useDeleteDirectMessageMutation,
  useReactToDirectMessageMutation,
  useReplyToDirectMessageMutation,
} = directMessagesApiSlice;
