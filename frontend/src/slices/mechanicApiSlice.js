import { MECHANIC_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const mechanicApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // Fetch all mechanics
        getMechanics: builder.query({
            query: () => ({
                url: MECHANIC_URL,
                method: 'GET',
            }),
        }),

        // Fetch mechanic by ID
        getMechanicById: builder.query({
            query: (id) => ({
                url: `${MECHANIC_URL}/${id}`,
                method: 'GET',
            }),
        }),

        // Create a review for a mechanic
        createMechanicReview: builder.mutation({
            query: (data) => ({
                url: `${MECHANIC_URL}/${data.mechanicId}/reviews`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Mechanic"],
        }),

        // Fetch filtered mechanics
        getFilteredMechanics: builder.query({
            query: (filters) => ({
                url: `${MECHANIC_URL}/filter`,
                method: 'GET',
                params: filters,
            }),
        }),

        // Fetch filtered mechanics
        getFilteredOptions: builder.query({
            query: () => ({
                url: `${MECHANIC_URL}/filters`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetMechanicsQuery,
    useGetMechanicByIdQuery,
    useCreateMechanicReviewMutation,
    useGetFilteredMechanicsQuery,
    useGetFilteredOptionsQuery
} = mechanicApiSlice;
