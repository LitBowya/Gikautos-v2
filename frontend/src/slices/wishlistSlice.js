import { WISHLIST_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const wishlistSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: (data) => ({
        url: `${WISHLIST_URL}/getwishlist`,
        method: "GET",
        body: data,
      }),
    }),

    addToWishlist: builder.mutation({
      query: ({ productId }) => ({
        url: `${WISHLIST_URL}/addtowishlist`,
        method: "POST",
        body: { productId },
      }),
    }),

    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `${WISHLIST_URL}/${productId}`,
        method: "DELETE",
      }),
    }),

    clearWishlist: builder.mutation({
      query: () => ({
        url: `${WISHLIST_URL}/clearwishlist`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
} = wishlistSlice;
