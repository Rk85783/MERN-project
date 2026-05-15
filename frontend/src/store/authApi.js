import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/me",
      transformResponse: (res) => res.user,
      providesTags: ["User"],
    }),

    registerUser: builder.mutation({
      query: (body) => ({ url: "/register", method: "POST", body }),
      invalidatesTags: ["User"],
    }),

    loginUser: builder.mutation({
      query: (body) => ({ url: "/login", method: "POST", body }),
      invalidatesTags: ["User"],
    }),

    logoutUser: builder.mutation({
      query: () => ({ url: "/logout", method: "GET" }),
      invalidatesTags: ["User"],
    }),

    forgotPassword: builder.mutation({
      query: (body) => ({ url: "/password/forgot", method: "POST", body }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, ...body }) => ({
        url: `/password/reset/${token}`,
        method: "PUT",
        body,
      }),
    }),

    updatePassword: builder.mutation({
      query: (body) => ({ url: "/password/update", method: "PUT", body }),
      invalidatesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (body) => ({ url: "/me/update", method: "PUT", body }),
      invalidatesTags: ["User"],
    }),

    getAllUsers: builder.query({
      query: () => "/admin/users",
      transformResponse: (res) => res.users,
      providesTags: ["User"],
    }),

    getSingleUser: builder.query({
      query: (id) => `/admin/user/${id}`,
      transformResponse: (res) => res.user,
    }),

    updateUserRole: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/user/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({ url: `/admin/user/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = authApi;
