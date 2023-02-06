import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Dog, Service, ContactForm } from "../types";

export interface CheckoutData {
  dogId: string;
  serviceIds: string[];
}

export interface CheckoutResult {
  id: string;
  dogId: string;
  dogName: string;
  services: Array<{
    id: string;
    title: string;
    price: number;
  }>;
  totalPrice: number;
  createdAt: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ['Checkout'],
  endpoints: (builder) => {
    return {
      getDogs: builder.query<Record<string, Dog>, void>({
        query: () => "/dogs"
      }),
      getServices: builder.query<Service[], void>({
        query: () => "/services"
      }),
      getService: builder.query<Service, string>({
        query: (id) => `/services/${id}`
      }),
      makeContact: builder.mutation<ContactForm, ContactForm>({
        query: (body) => ({
          url: "/contact",
          method: "POST",
          body,
        }),
      }),
      createCheckout: builder.mutation<CheckoutResult, CheckoutData>({
        query: (body) => ({
          url: "/checkout",
          method: "POST",
          body,
        }),
        invalidatesTags: ['Checkout'],
      }),
      getCheckout: builder.query<CheckoutResult, string>({
        query: (id) => `/checkout/${id}`,
        providesTags: ['Checkout'],
      }),
    };
  },
});

export const {
  useGetDogsQuery,
  useGetServicesQuery,
  useGetServiceQuery,
  useMakeContactMutation,
  useCreateCheckoutMutation,
  useGetCheckoutQuery,
} = api;
