import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userAuthApi = createApi({
  reducerPath: "userAuthApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://skdm.in/server/bhavinjavari/" }),
  endpoints: (builder) => ({
    branchDetails: builder.mutation({
      query: (user) => {
        return {
          url: "branch-detail.php/",
          method: "post",
          body: user,
          header: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    accountDetail: builder.mutation({
      query: (user) => {
        return {
          url: "user-detail.php/",
          method: "post",
          body: user,
          header: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    categoryDetail: builder.mutation({
      query: (user) => {
        return {
          url: "category.php/",
          method: "post",
          body: user,
          header: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    foodDetail: builder.mutation({
      query: (user) => {
        return {
          url: "product.php/",
          method: "post",
          body: user,
          header: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    notificationAdd: builder.mutation({
      query: (user) => {
        return {
          url: "notification.php/",
          method: "post",
          body: user,
          header: {
            "Content-type": "application/json",
          },
        };
      },
    }),
  }),
});

export const {
  useBranchDetailsMutation,
  useAccountDetailMutation,
  useCategoryDetailMutation,
  useFoodDetailMutation,
  useNotificationAddMutation
} = userAuthApi;
