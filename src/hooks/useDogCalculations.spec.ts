import { renderHook } from '@testing-library/react';
import { useDogCalculations } from '../hooks/useDogCalculations';

describe('useDogCalculations Hook', () => {
  describe('size calculation', () => {
    it('should return "teacup" for weight <= 10', () => {
      const { result } = renderHook(() => useDogCalculations({ weight: 8, dob: '2020-01-01' }));
      expect(result.current.size).toBe('teacup');
    });

    it('should return "small" for weight <= 25', () => {
      const { result } = renderHook(() => useDogCalculations({ weight: 20, dob: '2020-01-01' }));
      expect(result.current.size).toBe('small');
    });

    it('should return "medium" for weight <= 50', () => {
      const { result } = renderHook(() => useDogCalculations({ weight: 40, dob: '2020-01-01' }));
      expect(result.current.size).toBe('medium');
    });

    it('should return "large" for weight <= 80', () => {
      const { result } = renderHook(() => useDogCalculations({ weight: 70, dob: '2020-01-01' }));
      expect(result.current.size).toBe('large');
    });

    it('should return "x-large" for weight <= 125', () => {
      const { result } = renderHook(() => useDogCalculations({ weight: 100, dob: '2020-01-01' }));
      expect(result.current.size).toBe('x-large');
    });

    it('should return "jumbo" for weight > 125', () => {
      const { result } = renderHook(() => useDogCalculations({ weight: 150, dob: '2020-01-01' }));
      expect(result.current.size).toBe('jumbo');
    });

    it('should handle string weight values', () => {
      const { result } = renderHook(() => useDogCalculations({ weight: '30', dob: '2020-01-01' }));
      expect(result.current.size).toBe('medium');
    });
  });

  describe('age calculation', () => {
    it('should calculate age correctly', () => {
      // Using a fixed date for testing - approximately 5 years ago
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

      const { result } = renderHook(() =>
        useDogCalculations({ weight: 30, dob: fiveYearsAgo.toISOString() })
      );

      expect(result.current.age).toBeGreaterThanOrEqual(4);
      expect(result.current.age).toBeLessThanOrEqual(5);
    });

    it('should return 0 for dogs born this year', () => {
      const today = new Date().toISOString();
      const { result } = renderHook(() => useDogCalculations({ weight: 10, dob: today }));
      expect(result.current.age).toBe(0);
    });
  });

  describe('hook updates', () => {
    it('should recalculate when weight changes', () => {
      const { result, rerender } = renderHook(
        ({ weight, dob }) => useDogCalculations({ weight, dob }),
        { initialProps: { weight: 10, dob: '2020-01-01' } }
      );

      expect(result.current.size).toBe('teacup');

      rerender({ weight: 30, dob: '2020-01-01' });
      expect(result.current.size).toBe('medium');
    });
  });
});
