import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector
} from "@reduxjs/toolkit";
import type { Service } from "../../types";
import type { RootState } from "../../store";
import * as api from "../../api";
import { selectLuckyDogEntity } from "../dogs/dogsSlice";

// Create entity adapter for normalized service state
const servicesAdapter = createEntityAdapter<Service>({
  selectId: (service) => service.id,
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

interface ServicesExtraState {
  loading: boolean;
  error: string | null;
}

const initialState = servicesAdapter.getInitialState<ServicesExtraState>({
  loading: false,
  error: null,
});

// Async thunk to fetch services
export const fetchServices = createAsyncThunk<Service[]>(
  "services/fetchServices",
  async () => {
    const response = await api.getServices();
    return response;
  }
);

// Async thunk to fetch a single service
export const fetchServiceById = createAsyncThunk<Service, string>(
  "services/fetchServiceById",
  async (serviceId: string) => {
    const response = await fetch(`/api/services/${serviceId}`).then(res => res.json());
    return response;
  }
);

export const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        servicesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch services';
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        servicesAdapter.upsertOne(state, action.payload);
      });
  },
});

export default servicesSlice.reducer;

// Export entity adapter selectors
export const {
  selectAll: selectAllServices,
  selectById: selectServiceById,
  selectIds: selectServiceIds,
} = servicesAdapter.getSelectors((state: RootState) => state.services);

export const selectServicesLoading = (state: RootState) => state.services.loading;
export const selectServicesError = (state: RootState) => state.services.error;

// Memoized selector to filter services for the lucky dog
export const selectServicesForLuckyDog = createSelector(
  [selectAllServices, selectLuckyDogEntity],
  (services, luckyDog) => {
    // If no lucky dog selected, show all services
    if (!luckyDog) {
      return services;
    }

    // Filter services based on the lucky dog's attributes
    return services.filter((service) => {
      const { restrictions } = service;

      // Check age restriction
      if (restrictions.minAge && (luckyDog.age ?? 0) < restrictions.minAge) {
        return false;
      }

      // Check breed restriction
      if (restrictions.breed && !restrictions.breed.includes(luckyDog.breed)) {
        return false;
      }

      // Check size restriction
      if (restrictions.size && !restrictions.size.includes(luckyDog.size ?? '')) {
        return false;
      }

      return true;
    });
  }
);
