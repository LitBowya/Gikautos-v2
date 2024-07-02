import { apiSlice } from './apiSlice';
import { CHANNEL_URL } from '../constants';

export const channelsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChannel: builder.mutation({
      query: (channel) => ({
        url: CHANNEL_URL,
        method: 'POST',
        body: channel,
      }),
      invalidatesTags: ['Channel'],
    }),
    editChannel: builder.mutation({
      query: ({ channelId, channel }) => ({
        url: `${CHANNEL_URL}/${channelId}`,
        method: 'PUT',
        body: channel,
      }),
      invalidatesTags: ['Channel'],
    }),
    deleteChannel: builder.mutation({
      query: (channelId) => ({
        url: `${CHANNEL_URL}/${channelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Channel'],
    }),
    joinChannel: builder.mutation({
      query: (channelId) => ({
        url: `${CHANNEL_URL}/${channelId}/join`,
        method: 'POST',
      }),
      invalidatesTags: ['Channel'],
    }),
    leaveChannel: builder.mutation({
      query: (channelId) => ({
        url: `${CHANNEL_URL}/${channelId}/leave`,
        method: 'POST',
      }),
      invalidatesTags: ['Channel'],
    }),
    fetchChannels: builder.query({
      query: () => ({
        url: CHANNEL_URL,
        method: 'GET',
      }),
      providesTags: ['Channel'],
    }),
    fetchChannelMembers: builder.query({
      query: (channelId) => ({
        url: `${CHANNEL_URL}/${channelId}/members`,
      }),
      providesTags: ['Channel'],
    }),
  }),
});

export const {
  useCreateChannelMutation,
  useEditChannelMutation,
  useDeleteChannelMutation,
  useJoinChannelMutation,
  useLeaveChannelMutation,
  useFetchChannelsQuery,
  useFetchChannelMembersQuery,
} = channelsApiSlice;
