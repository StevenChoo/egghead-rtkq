import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Dog, Service, ContactForm } from "../types";
import { getSize, getAge } from "../utils/dogUtils";

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
  tagTypes: ["Dog", "Service", "Checkout"],
  endpoints: (builder) => ({
    // Dogs endpoints
    getDogs: builder.query<Record<string, Dog>, void>({
      query: () => "/dogs",
      // Granular cache tags - tag both the collection and individual dogs
      providesTags: (result) =>
        result
          ? [
              { type: 'Dog', id: 'LIST' },
              ...Object.keys(result).map((id) => ({ type: 'Dog' as const, id })),
            ]
          : [{ type: 'Dog', id: 'LIST' }],
      // transformResponse: centralized data transformation
      transformResponse: (response: Record<string, Omit<Dog, 'size' | 'age'>>) => {
        const transformedDogs: Record<string, Dog> = {};
        for (const id in response) {
          const dog = response[id];
          transformedDogs[id] = {
            ...dog,
            size: getSize(dog.weight),
            age: getAge(dog.dob),
          };
        }
        return transformedDogs;
      },
    }),
    addDog: builder.mutation<{ success: boolean }, Omit<Dog, "id" | "size" | "age">>({
      query: (body) => ({
        url: "/dogs",
        method: "POST",
        body,
      }),
      // Only invalidate the list, not individual dogs
      invalidatesTags: [{ type: 'Dog', id: 'LIST' }],
    }),
    removeDog: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/dogs/${id}`,
        method: "DELETE",
      }),
      // Optimistic update using onQueryStarted
      async onQueryStarted(dogId, { dispatch, queryFulfilled }) {
        // Optimistically update the cache
        const patchResult = dispatch(
          api.util.updateQueryData('getDogs', undefined, (draft) => {
            delete draft[dogId];
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Undo the optimistic update on error
          patchResult.undo();
        }
      },
      // Invalidate specific dog and list tags
      invalidatesTags: (_result, _error, id) => [
        { type: 'Dog', id },
        { type: 'Dog', id: 'LIST' },
      ],
    }),

    // Services endpoints
    getServices: builder.query<Service[], void>({
      query: () => "/services",
      // Granular cache tags for services
      providesTags: (result) =>
        result
          ? [
              { type: 'Service', id: 'LIST' },
              ...result.map(({ id }) => ({ type: 'Service' as const, id })),
            ]
          : [{ type: 'Service', id: 'LIST' }],
    }),
    getService: builder.query<Service, string>({
      query: (id) => `/services/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Service', id }],
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
