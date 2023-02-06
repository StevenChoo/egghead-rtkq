# Redux Toolkit (Without RTK Query) Implementation

This branch demonstrates traditional Redux Toolkit patterns using **createSlice**, **createAsyncThunk**, **createEntityAdapter**, and **createSelector** for data fetching and state management.

## Key Features

### 1. Entity Adapters for Normalized State

Both dogs and services use `createEntityAdapter` for efficient normalized state management:

```typescript
const dogsAdapter = createEntityAdapter<Dog>({
  selectId: (dog) => dog.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = dogsAdapter.getInitialState<DogsExtraState>({
  luckyDog: "",
  loading: false,
  error: null,
});
```

**Benefits:**
- Normalized state structure with `ids` and `entities`
- Built-in CRUD operations: `setAll`, `addOne`, `removeOne`, `upsertOne`
- Auto-generated selectors: `selectAll`, `selectById`, `selectIds`

### 2. Async Thunks for Data Fetching

All API calls use `createAsyncThunk`:

```typescript
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
    // Manually refetch after mutation
    dispatch(fetchDogs());
  }
);
```

### 3. Reducer Handling with extraReducers

Thunks are handled in the slice's `extraReducers`:

```typescript
extraReducers: (builder) => {
  builder
    .addCase(fetchDogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchDogs.fulfilled, (state, action) => {
      state.loading = false;
      const dogsArray = transformDogs(action.payload);
      dogsAdapter.setAll(state, dogsArray);
    })
    .addCase(fetchDogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch dogs';
    })
}
```

### 4. Memoized Selectors with createSelector

Performance optimization using memoized selectors:

```typescript
// Memoized selector that only recalculates when dependencies change
export const selectServicesForLuckyDog = createSelector(
  [selectAllServices, selectLuckyDogEntity],
  (services, luckyDog) => {
    if (!luckyDog) return services;

    return services.filter((service) => {
      const { restrictions } = service;
      return (
        (!restrictions.minAge || luckyDog.age >= restrictions.minAge) &&
        (!restrictions.breed || restrictions.breed.includes(luckyDog.breed)) &&
        (!restrictions.size || restrictions.size.includes(luckyDog.size))
      );
    });
  }
);
```

This prevents unnecessary re-renders by caching results until input data changes.

### 5. Component Integration

Components use `useEffect` to fetch data and `useSelector` with memoized selectors:

```typescript
export function DogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const myDogs = useSelector(selectAllDogs);
  const isLoading = useSelector(selectDogsLoading);

  useEffect(() => {
    dispatch(fetchDogs());
  }, [dispatch]);

  const handleAddDog = (dogData: DogInput) => {
    dispatch(addDog(dogData));
  };
}
```

## Architecture Comparison

### vs. RTK Query
- **Manual refetching**: Must dispatch `fetchDogs()` after mutations
- **Manual loading states**: Track loading/error in slice state
- **More boilerplate**: Need to write async thunks, reducers, selectors
- **More control**: Full control over caching and refetching logic

### Advantages
- **Normalized state**: Entity adapters provide efficient lookups by ID
- **Memoization**: Selectors prevent unnecessary component re-renders
- **Type safety**: Full TypeScript support with inferred types
- **Flexibility**: Complete control over state shape and update logic

## File Structure

```
src/
├── pages/
│   ├── dogs/
│   │   ├── dogsSlice.ts      # Entity adapter, thunks, selectors
│   │   └── DogsPage.tsx      # Component using selectors
│   └── services/
│       ├── servicesSlice.ts   # Entity adapter, thunks, selectors
│       └── ServicesPage.tsx   # Component with memoized selector
├── store/
│   └── index.ts              # Store configuration (no RTK Query)
└── api.ts                    # Plain fetch functions
```

## Running the Application

```bash
npm install
npm run dev
```

## Key Takeaways

1. **Entity Adapters** eliminate manual normalization boilerplate
2. **createSelector** prevents expensive recalculations and re-renders
3. **createAsyncThunk** standardizes async action patterns
4. Manual cache management provides flexibility at the cost of more code

This approach is ideal when you need fine-grained control over state management and don't want the opinionated caching of RTK Query.
