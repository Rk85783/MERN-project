import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    newOrder: builder.mutation({
      query: (body) => ({ url: "/order/new", method: "POST", body }),
      invalidatesTags: ["Order"],
    }),

    myOrders: builder.query({
      query: () => "/order/me",
      transformResponse: (res) => res.orders,
      providesTags: ["Order"],
    }),

    getSingleOrder: builder.query({
      query: (id) => `/order/${id}`,
      transformResponse: (res) => res.order,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    getAllOrders: builder.query({
      query: () => "/admin/orders",
      transformResponse: (res) => ({ orders: res.orders, totalAmount: res.totalAmount }),
      providesTags: ["Order"],
    }),

    updateOrder: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/orders/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Order"],
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({ url: `/admin/orders/${id}`, method: "DELETE" }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useNewOrderMutation,
  useMyOrdersQuery,
  useGetSingleOrderQuery,
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
