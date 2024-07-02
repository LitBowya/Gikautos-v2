import { apiSlice } from './apiSlice';
import { REPLY_URL } from '../constants';

export const repliesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchReplies: builder.query({
      query: () => `${REPLY_URL}`,
      providesTags: ['Reply'],
    }),
    editReply: builder.mutation({
      query: ({ replyId, reply }) => ({
        url: `${REPLY_URL}/${replyId}`,
        method: 'PUT',
        body: reply,
      }),
      invalidatesTags: ['Reply'],
    }),
    deleteReply: builder.mutation({
      query: (replyId) => ({
        url: `${REPLY_URL}/${replyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reply'],
    }),
    reactToReply: builder.mutation({
      query: ({ replyId, reaction }) => ({
        url: `${REPLY_URL}/${replyId}/react`,
        method: 'POST',
        body: { reaction },
      }),
      invalidatesTags: ['Reply'],
    }),
    replyToReply: builder.mutation({
      query: ({ replyId, reply }) => ({
        url: `${REPLY_URL}/${replyId}/reply`,
        method: 'POST',
        body: reply,
      }),
      invalidatesTags: ['Reply'],
    }),
  }),
});

export const {
  useFetchRepliesQuery,
  useEditReplyMutation,
  useDeleteReplyMutation,
  useReactToReplyMutation,
  useReplyToReplyMutation,
} = repliesApiSlice;
