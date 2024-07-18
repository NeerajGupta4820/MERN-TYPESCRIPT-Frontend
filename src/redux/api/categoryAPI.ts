import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {AllCategoriesResponse, CategoryResponse, DeleteCategoryRequest, MessageResponse, NewCategoryRequest, UpdateCategoryRequest,} from "../../types/api-types";

export const categoryAPI=createApi({
    reducerPath:"categoryApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/category/`,
    }),
    tagTypes:["category"],
    endpoints:(builder)=>({
        getAllCategories:builder.query<AllCategoriesResponse,void>({
            query:()=>"/",
            providesTags:["category"],
        }),
        getCategory:builder.query<CategoryResponse,string>({
            query:(slug)=>`/${slug}`,
            providesTags:["category"],
        }),
        newCategory:builder.mutation<MessageResponse,NewCategoryRequest>({
            query:(newCategory)=>({
                url:"/new",
                method:"POST",
                body:newCategory,
            }),
            invalidatesTags:["category"]
        }),
        updateCategory: builder.mutation<MessageResponse, UpdateCategoryRequest>({
            query: ({ id,userId, ...updateCategory }) => ({
              url: `/${id}?id=${userId}`,
              method: "PUT",
              body: updateCategory,
            }),
            invalidatesTags: ["category"]
          }),
        deleteCategory:builder.mutation<MessageResponse,DeleteCategoryRequest>({
            query:({userId,id})=>({
                url:`/${id}?id=${userId}`,
                method:"DELETE",
            }),
            invalidatesTags:["category"]
        }),
    })
})

export const {useGetAllCategoriesQuery,useGetCategoryQuery,useNewCategoryMutation,
    useUpdateCategoryMutation,useDeleteCategoryMutation} = categoryAPI;