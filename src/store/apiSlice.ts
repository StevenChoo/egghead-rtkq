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
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Dogs", "Services", "Checkout"],
  endpoints: (builder) => ({
    // Dogs endpoints
    getDogs: builder.query<Record<string, Dog>, void>({
      query: () => "/dogs",
      providesTags: ["Dogs"],
    }),
    addDog: builder.mutation<{ success: boolean }, Omit<Dog, "id">>({
      query: (body) => ({
        url: "/dogs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Dogs"],
    }),
    removeDog: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/dogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Dogs"],
    }),

    // Services endpoints
    getServices: builder.query<Service[], void>({
      query: () => "/services",
      providesTags: ["Services"],
    }),
    getService: builder.query<Service, string>({
      query: (id) => `/services/${id}`,
    }),

    // Contact endpoint
    makeContact: builder.mutation<ContactForm, ContactForm>({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
    }),

    // Checkout endpoints
    createCheckout: builder.mutation<CheckoutResult, CheckoutData>({
      query: (body) => ({
        url: "/checkout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Checkout"],
    }),
    getCheckout: builder.query<CheckoutResult, string>({
      query: (id) => `/checkout/${id}`,
      providesTags: ["Checkout"],
    }),
  }),
});

export const {
  useGetDogsQuery,
  useAddDogMutation,
  useRemoveDogMutation,
  useGetServicesQuery,
  useGetServiceQuery,
  useMakeContactMutation,
  useCreateCheckoutMutation,
  useGetCheckoutQuery,
} = api;
