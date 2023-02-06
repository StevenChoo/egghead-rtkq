import { useMemo } from 'react';
import { getSize, getAge } from '../pages/dogs/dogsSlice';

export interface DogInput {
  weight: number | string;
  dob: string;
}

export interface DogCalculations {
  size: string;
  age: number;
}

/**
 * Custom hook that calculates dog size and age based on weight and date of birth
 * @param dog - Object containing weight and dob
 * @returns Object with calculated size and age
 */
export function useDogCalculations(dog: DogInput): DogCalculations {
  const size = useMemo(() => getSize(dog.weight), [dog.weight]);
  const age = useMemo(() => getAge(dog.dob), [dog.dob]);

  return { size, age };
}
