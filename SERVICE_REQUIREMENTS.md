# Service Requirements for Dogs

This document explains the eligibility criteria for dogs to qualify for grooming services.

## Overview

A dog must meet **ALL** of the restrictions specified for each service. Services filter dogs based on three criteria:
1. Age (minimum age requirement)
2. Size (based on weight)
3. Breed (specific breeds only - rare)

## How Dog Properties Are Calculated

### Age Calculation
```javascript
Age = Math.floor((Current Date - Birth Date) / YEAR)
where YEAR = 3.156e10 milliseconds
```

### Size Categories (based on weight in pounds)
| Size | Weight Range |
|------|--------------|
| **teacup** | ≤ 10 lbs |
| **small** | 11-25 lbs |
| **medium** | 26-50 lbs |
| **large** | 51-80 lbs |
| **x-large** | 81-125 lbs |
| **jumbo** | > 125 lbs |

## Service Requirements

### 1. Fur Trim ✂️
**Price:** $54.99

**Requirements:**
- Minimum age: **1 year**
- Allowed sizes: teacup, small, medium, large, x-large
- Breed: Any

### 2. Tooth Brushing 😬
**Price:** $8.99

**Requirements:**
- Minimum age: **3 years**
- Allowed sizes: teacup, small, medium, large, x-large
- Breed: Any

### 3. Ear Cleaning 👂
**Price:** $12.50

**Requirements:**
- Minimum age: **1 year**
- Allowed sizes: small, medium, large, x-large
- Breed: Any
- **Note:** Does NOT accept teacup or jumbo dogs

### 4. Full Wash & Grooming 🛁
**Price:** $89.99

**Requirements:**
- Minimum age: **1 year**
- Allowed sizes: teacup, small, medium, large
- Breed: Any
- **Note:** Does NOT accept x-large or jumbo dogs

### 5. Singing Lessons 🎤
**Price:** $89.99

**Requirements:**
- Minimum age: **3 years**
- Allowed sizes: large, x-large, jumbo
- Breed: **husky, hound, beagle, shephard ONLY**

## When Dogs Qualify for NO Services

A dog will be "unlucky" and qualify for zero services if they are:

- **Jumbo-sized** (>125 lbs) **AND** not one of these breeds: husky, hound, beagle, shephard

This is because jumbo dogs can only qualify for "Singing Lessons", which has strict breed requirements.

## Example Scenarios

### Example 1: "Buddy" - Golden Retriever
- Weight: 30 lbs → **medium** size
- DOB: 2020-01-15 → **~5 years old**
- Breed: golden-retriever

**Qualifies for:** ✅ Fur Trim, Tooth Brushing, Ear Cleaning, Full Wash & Grooming (4/5 services)

### Example 2: Tiny Puppy
- Weight: 8 lbs → **teacup** size
- DOB: 6 months ago → **0 years old**
- Breed: poodle

**Qualifies for:** ❌ No services (too young - all services require minimum 1 year)

### Example 3: Large Adult Husky
- Weight: 150 lbs → **jumbo** size
- DOB: 2018-01-01 → **~7 years old**
- Breed: husky

**Qualifies for:** ✅ Singing Lessons only (1/5 services)

### Example 4: Unlucky Dog
- Weight: 150 lbs → **jumbo** size
- DOB: 2018-01-01 → **~7 years old**
- Breed: golden-retriever

**Qualifies for:** ❌ No services (jumbo size but not a qualifying breed for Singing Lessons)

## Implementation Details

The service filtering logic is implemented in `src/pages/services/servicesSlice.ts` in the `getServicesForLuckyDog` function:

```typescript
export const getServicesForLuckyDog = (
  state: RootState,
  services: Service[] = [],
  dogs: Record<string, Dog> = {}
): Service[] => {
  const dog = dogs?.[state.dogs.luckyDog];
  if (!dog) {
    return services; // Show all services if no dog selected
  }

  // Filter services based on dog's properties
  return services
    .filter(({ restrictions }) => {
      return restrictions.minAge ? (dog.age ?? 0) >= restrictions.minAge : true;
    })
    .filter(({ restrictions }) => {
      return restrictions.breed ? restrictions.breed.includes(dog.breed) : true;
    })
    .filter(({ restrictions }) => {
      return restrictions.size ? restrictions.size.includes(dog.size ?? '') : true;
    });
};
```

## Testing Tips

When writing tests for service eligibility:

1. **Test age boundaries:** Dogs that are exactly the minimum age should qualify
2. **Test size categories:** Know the weight thresholds for each size
3. **Test breed restrictions:** Only Singing Lessons has breed requirements
4. **Test edge cases:** Jumbo dogs with non-qualifying breeds should see zero services
5. **Test new dogs:** Dogs less than 1 year old won't qualify for any services
