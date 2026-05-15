import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["Product", "Review"],
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"],
    }),

    getProductDetails: builder.query({
      query: (id) => `/product/${id}`,
      transformResponse: (res) => res.product,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation({
      query: (body) => ({ url: "/admin/product/new", method: "POST", body }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/product/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => ["Product", { type: "Product", id }],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/admin/product/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product"],
    }),

    createReview: builder.mutation({
      query: (body) => ({ url: "/review", method: "PUT", body }),
      invalidatesTags: ["Review"],
    }),

    getProductReviews: builder.query({
      query: (id) => `/reviews?id=${id}`,
      transformResponse: (res) => res.reviews,
      providesTags: ["Review"],
    }),

    deleteReview: builder.mutation({
      query: ({ id, reviewId }) => ({
        url: `/reviews?id=${id}&reviewId=${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetProductReviewsQuery,
  useDeleteReviewMutation,
} = productApi;
