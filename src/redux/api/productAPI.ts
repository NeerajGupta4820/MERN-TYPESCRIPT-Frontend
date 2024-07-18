import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {AllProductsResponse,AllReviewsResponse,CategoryProductsResponse,DeleteProductRequest,DeleteReviewRequest,MessageResponse,NewProductRequest,NewReviewRequest,ProductResponse,SearchProductsRequest,SearchProductsResponse, UpdateProductRequest,} from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  tagTypes:["product"],
  endpoints: (builder) => ({
    latestProdcuts: builder.query<AllProductsResponse, string>({
      query: () => "latest", 
      providesTags: ["product"],
    }),
    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["product"],
    }),
    searchData: builder.query<SearchProductsResponse,SearchProductsRequest>({
      query: ({ price, search, sort, category, page, brand, discount, ratings  }) => {
        let base = `all?search=${search}&page=${page}`;

        if (price) base += `&price=${price}`;
        if (sort) base += `&sort=${sort}`;
        if (category) base += `&category=${category}`;
        if (brand) base += `&brand=${brand}`;
        if (discount) base += `&discount=${discount}`;
        if (ratings) base += `&ratings=${ratings}`;

        return base;
      },
      providesTags: ["product"],
    }),
    searchproduct: builder.query<SearchProductsResponse, string>({
      query: (query) => `search-data?query=${query}`,
      providesTags: ["product"],
     }),
    productDetails: builder.query<ProductResponse, string>({
      query: (id) => id,
      providesTags: ["product"],
    }),
    newProducts:builder.mutation<MessageResponse,NewProductRequest>({
        query:({formData,id})=>({
          url:`new?id=${id}`,
          method:"post",
          body:formData
        }),
        invalidatesTags:["product"]
    }),
    updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
    productCategory: builder.query<CategoryProductsResponse, string>({
      query: (slug) => `product-category/${slug}`,
      providesTags: ["product"],
    }),
    relatedProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `related-products/${id}`,
      providesTags: ["product"],
    }),
    allReviewsOfProducts: builder.query<AllReviewsResponse, string>({
      query: (productId) => `review/${productId}`,
      providesTags: ["product"],
    }),

    newReview: builder.mutation<MessageResponse, NewReviewRequest>({
      query: ({ comment, rating, productId, userId }) => ({
        url: `review/new/${productId}?id=${userId}`,
        method: "POST",
        body: { comment, rating },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["product"],
    }),

    deleteReview: builder.mutation<MessageResponse, DeleteReviewRequest>({
      query: ({ reviewId, userId }) => ({
        url: `/review/${reviewId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {useLatestProdcutsQuery,useAllProductsQuery,useSearchDataQuery,useNewProductsMutation,
  useProductDetailsQuery,useUpdateProductMutation,useDeleteProductMutation,useProductCategoryQuery,useSearchproductQuery,
  useRelatedProductsQuery,useAllReviewsOfProductsQuery,useNewReviewMutation,useDeleteReviewMutation} = productAPI;
