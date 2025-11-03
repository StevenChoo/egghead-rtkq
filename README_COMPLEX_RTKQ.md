# Complex RTK Query Implementation

This branch demonstrates advanced RTK Query patterns for production-ready applications. These patterns optimize performance, improve user experience, and provide better cache management.

## Advanced Features Implemented

### 1. Centralized Data Transformation with `transformResponse`

**Location**: `src/store/apiSlice.ts:40-51`

Instead of transforming data in every component with `useMemo`, we centralize transformations in the API slice:

```typescript
getDogs: builder.query<Record<string, Dog>, void>({
  query: () => "/dogs",
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
```

**Benefits**:
- Transforms data once at the API boundary, not in every component
- Reduces duplicate transformation logic across components
- Cached data is already transformed and ready to use
- Components become simpler and more focused on presentation

**When to use**:
- When multiple components need the same derived data
- For calculations that don't depend on component-specific state
- When data transformation is expensive or complex

### 2. Granular Cache Tags

**Location**: `src/store/apiSlice.ts:26,32-38,94-100`

Using both LIST and ID-based tags for surgical cache invalidation:

```typescript
tagTypes: ["Dog", "Service", "Checkout"],

getDogs: builder.query<Record<string, Dog>, void>({
  providesTags: (result) =>
    result
      ? [
          { type: 'Dog', id: 'LIST' },
          ...Object.keys(result).map((id) => ({ type: 'Dog' as const, id })),
        ]
      : [{ type: 'Dog', id: 'LIST' }],
}),

addDog: builder.mutation<{ success: boolean }, Omit<Dog, "id" | "size" | "age">>({
  // Only invalidate the list, not individual dogs
  invalidatesTags: [{ type: 'Dog', id: 'LIST' }],
}),

removeDog: builder.mutation<{ id: string }, string>({
  invalidatesTags: (_result, _error, id) => [
    { type: 'Dog', id },
    { type: 'Dog', id: 'LIST' },
  ],
}),
```

**Benefits**:
- Precise control over what gets refetched
- Adding a dog only invalidates the list, not individual dog queries
- Removing a dog invalidates both the specific dog and the list
- Reduces unnecessary network requests

**Tag Strategy**:
- `LIST` tag: Represents the collection endpoint
- ID-based tags: Represent individual resource queries
- Mutations selectively invalidate only what changed

**When to use**:
- In applications with many related queries
- When mutations affect specific resources
- To optimize performance in large datasets

### 3. Optimistic Updates

**Location**: `src/store/apiSlice.ts:68-82`

Updates the UI immediately, then rolls back if the mutation fails:

```typescript
removeDog: builder.mutation<{ id: string }, string>({
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
}),
```

**Benefits**:
- Instant UI feedback - no waiting for server response
- Automatic rollback on failure
- Better perceived performance
- Improved user experience

**When to use**:
- For mutations with predictable outcomes
- When server response time affects UX
- For delete operations or simple updates
- **Not recommended for**: Complex mutations with side effects, or when server might return different data

### 4. Prefetching

**Location**: `src/main.tsx:17-19`

Loads critical data before user navigation:

```typescript
// Prefetch critical data on app initialization
store.dispatch(api.util.prefetch('getDogs', undefined, { force: false }));
store.dispatch(api.util.prefetch('getServices', undefined, { force: false }));
```

**Benefits**:
- Data is available immediately when components mount
- Reduces perceived loading time
- Better user experience on initial page load
- Cache respects existing data (force: false)

**When to use**:
- For data needed on most pages
- For initial app load
- Before user navigation (e.g., on button hover)
- Not recommended for: Rarely used data or data that changes frequently

## Architecture Decisions

### Pure RTK Query Approach

This implementation removes traditional Redux slices for server state:
- ❌ No `dogsSlice.ts` or `servicesSlice.ts`
- ✅ Only RTK Query for server data
- ✅ Minimal Redux slices for UI state (`uiSlice.ts`, `cartSlice.ts`)

### State Organization

```
Redux Store:
├── api (RTK Query)
│   ├── getDogs
│   ├── getServices
│   ├── addDog
│   └── removeDog
├── cart (local state)
│   └── items
└── ui (local state)
    └── luckyDogId
```

## Performance Optimizations

1. **transformResponse**: Transform once, use everywhere
2. **Granular tags**: Invalidate only what changed
3. **Optimistic updates**: Instant UI feedback
4. **Prefetching**: Preload critical data
5. **setupListeners**: Auto-refetch on focus/reconnect

## Testing Considerations

All tests continue to work with these advanced features:
- Mock Service Worker (MSW) handles API mocking
- Optimistic updates are tested via UI interaction
- Cache invalidation is implicit in component behavior
- Tests focus on user experience, not implementation details

## Migration from Simple RTK Query

If migrating from the `simple-rtkq` branch:

1. **Add transformResponse**: Move useMemo transformations to API slice
2. **Update tags**: Change from `["Dogs"]` to `["Dog", "LIST"]` pattern
3. **Add optimistic updates**: For delete operations
4. **Add prefetching**: In main.tsx for critical data
5. **Remove useMemo**: Components use transformed data directly

## Common Patterns

### When to use each pattern

| Pattern | Use When | Avoid When |
|---------|----------|------------|
| transformResponse | Data needs same transformation everywhere | Transformation depends on component state |
| Granular tags | Many related queries exist | Simple CRUD with few queries |
| Optimistic updates | Predictable mutations | Complex server logic or side effects |
| Prefetching | Data needed immediately | Rarely accessed or frequently changing data |

## Further Reading

- [RTK Query: Optimistic Updates](https://redux-toolkit.js.org/rtk-query/usage/optimistic-updates)
- [RTK Query: Automated Re-fetching](https://redux-toolkit.js.org/rtk-query/usage/automated-refetching)
- [RTK Query: Prefetching](https://redux-toolkit.js.org/rtk-query/usage/prefetching)
- [RTK Query: Code Splitting](https://redux-toolkit.js.org/rtk-query/usage/code-splitting)
