import { USERS_URL, UPLOAD_URL, MECHANIC_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // User login
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: "POST",
                body: data,
            }),
        }),

        // User logout
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST",
            }),
        }),

        // User registration
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: "POST",
                body: data,
            }),
        }),

        // Update user profile
        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: "PUT",
                body: data,
            }),
        }),

        // Update user location
        updateUserLocation: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/updateLocation`,
                method: "PUT",
                body: data,
            }),
        }),

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

        // Get nearby mechanics
        getNearbyMechanics: builder.query({
            query: ({ latitude, longitude }) => ({
                url: `${USERS_URL}/nearbyMechanics`,
                params: { latitude, longitude }, // Pass coordinates as query parameters
            }),
        }),

        // Place an order
        placeOrder: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/placeOrder`,
                method: "POST",
                body: data,
            }),
        }),

        // Fetch all users
        getUsers: builder.query({
            query: () => ({
                url: USERS_URL,
            }),
            providesTags: ["Users"],
        }),

        // Delete user by ID
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],
        }),

        // Fetch user by ID
        getUserDetails: builder.query({
            query: (id) => ({
                url: `${USERS_URL}/${id}`,
            }),
        }),

        // Update user by ID
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        // Upload profile picture
        uploadProfilePicture: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}/single`,
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileMutation,
    useUpdateUserLocationMutation,
    useGetNearbyMechanicsQuery,
    usePlaceOrderMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserDetailsQuery,
    useUpdateUserMutation,
    useUploadProfilePictureMutation,
} = usersApiSlice;
