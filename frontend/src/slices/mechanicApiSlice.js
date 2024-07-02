import { MECHANIC_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMechanics: builder.query({
      query: () => ({
        url: `${MECHANIC_URL}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getMechanicDetails: builder.query({
      query: (mechanicId) => ({
        url: `${MECHANIC_URL}/${mechanicId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createMechanicReview: builder.mutation({
        query: (data) => ({
          url: `${MECHANIC_URL}/${data.mechanicId}/reviews`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Mechanic"],
      }),
  }),
});

export const {
  useGetMechanicsQuery,
  useGetMechanicDetailsQuery,
  useCreateMechanicReviewMutation,
} = usersApiSlice;
