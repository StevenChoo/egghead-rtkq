import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction
} from "@reduxjs/toolkit";
import type { Dog, DogInput } from "../../types";
import type { RootState } from "../../store";
import * as api from "../../api";

// Create entity adapter for normalized dog state
const dogsAdapter = createEntityAdapter<Dog>({
  selectId: (dog) => dog.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

interface DogsExtraState {
  luckyDog: string;
  loading: boolean;
  error: string | null;
}

const initialState = dogsAdapter.getInitialState<DogsExtraState>({
  luckyDog: "",
  loading: false,
  error: null,
});

// Async thunks for API calls
export const fetchDogs = createAsyncThunk<Record<string, Dog>>(
  "dogs/fetchDogs",
  async () => {
    const response = await api.getDogs();
    return response;
  }
);

export const addDog = createAsyncThunk<void, DogInput>(
  "dogs/addDog",
  async (dogDetails: DogInput, { dispatch }) => {
    await api.addDog(dogDetails);
    // Refetch dogs after adding
    dispatch(fetchDogs());
  }
);

export const removeDog = createAsyncThunk<string, string>(
  "dogs/removeDog",
  async (dogId: string) => {
    await api.deleteDog(dogId);
    return dogId;
  }
);

export const dogsSlice = createSlice({
  name: "dogs",
  initialState,
  reducers: {
    luckyDogChosen: (state, action: PayloadAction<{ id: string }>) => {
      state.luckyDog = action.payload.id;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dogs
      .addCase(fetchDogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDogs.fulfilled, (state, action) => {
        state.loading = false;
        const dogs = action.payload;
        const dogsArray: Dog[] = [];

        // Transform and calculate derived properties
        for (const id in dogs) {
          const dog = dogs[id];
          dogsArray.push({
            ...dog,
            size: getSize(dog.weight),
            age: getAge(dog.dob),
          });
        }

        // Use adapter to set all dogs in normalized state
        dogsAdapter.setAll(state, dogsArray);
      })
      .addCase(fetchDogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dogs';
      })

      // Remove dog - optimistic update
      .addCase(removeDog.pending, (state, action) => {
        dogsAdapter.removeOne(state, action.meta.arg);
      })
      .addCase(removeDog.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to remove dog';
        // Could revert the optimistic update here by refetching
      });
  },
});

// Action creators are generated for each case reducer function
export const { luckyDogChosen } = dogsSlice.actions;

export default dogsSlice.reducer;

// Export entity adapter selectors
export const {
  selectAll: selectAllDogs,
  selectById: selectDogById,
  selectIds: selectDogIds,
} = dogsAdapter.getSelectors((state: RootState) => state.dogs);

// Memoized selectors using createSelector
import { createSelector } from "@reduxjs/toolkit";

export const selectLuckyDog = (state: RootState) => state.dogs.luckyDog;
export const selectDogsLoading = (state: RootState) => state.dogs.loading;
export const selectDogsError = (state: RootState) => state.dogs.error;

// Memoized selector to get the lucky dog entity
export const selectLuckyDogEntity = createSelector(
  [selectAllDogs, selectLuckyDog],
  (dogs, luckyDogId) => dogs.find((dog) => dog.id === luckyDogId)
);

// utilities

export function getSize(weight: number | string): string {
  const w = typeof weight === 'string' ? parseInt(weight, 10) : weight;
  if (w <= 10) return "teacup";
  if (w <= 25) return "small";
  if (w <= 50) return "medium";
  if (w <= 80) return "large";
  if (w <= 125) return "x-large";
  return "jumbo";
}

const YEAR = 3.156e10;
export function getAge(dob: string): number {
  const date = +new Date(dob);
  return Math.floor((Date.now() - date) / YEAR);
}
