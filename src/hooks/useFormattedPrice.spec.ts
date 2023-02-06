import { renderHook } from '@testing-library/react';
import { useFormattedPrice } from './useFormattedPrice';

describe('useFormattedPrice Hook', () => {
  describe('basic formatting', () => {
    it('should format a numeric price correctly', () => {
      const { result } = renderHook(() => useFormattedPrice(54.99));
      expect(result.current).toBe('$54.99');
    });

    it('should format a string price correctly', () => {
      const { result } = renderHook(() => useFormattedPrice('89.99'));
      expect(result.current).toBe('$89.99');
    });

    it('should format whole numbers with decimal places', () => {
      const { result } = renderHook(() => useFormattedPrice(50));
      expect(result.current).toBe('$50.00');
    });

    it('should handle zero price', () => {
      const { result } = renderHook(() => useFormattedPrice(0));
      expect(result.current).toBe('$0.00');
    });
  });

  describe('edge cases', () => {
    it('should handle invalid string input', () => {
      const { result } = renderHook(() => useFormattedPrice('invalid'));
      expect(result.current).toBe('$0.00');
    });

    it('should handle negative prices', () => {
      const { result } = renderHook(() => useFormattedPrice(-25.50));
      expect(result.current).toBe('-$25.50');
    });

    it('should handle very large numbers', () => {
      const { result } = renderHook(() => useFormattedPrice(1234567.89));
      expect(result.current).toBe('$1,234,567.89');
    });
  });

  describe('custom options', () => {
    it('should respect custom maximum fraction digits', () => {
      const { result } = renderHook(() =>
        useFormattedPrice(54.999, { maximumFractionDigits: 0, minimumFractionDigits: 0 })
      );
      expect(result.current).toBe('$55');
    });

    it('should allow custom minimum fraction digits', () => {
      const { result } = renderHook(() =>
        useFormattedPrice(54, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
      );
      expect(result.current).toBe('$54');
    });
  });

  describe('memoization', () => {
    it('should return same value for same input', () => {
      const { result, rerender } = renderHook(
        ({ price }) => useFormattedPrice(price),
        { initialProps: { price: 54.99 } }
      );

      const firstResult = result.current;
      rerender({ price: 54.99 });
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
      expect(firstResult).toBe('$54.99');
    });

    it('should recalculate when price changes', () => {
      const { result, rerender } = renderHook(
        ({ price }) => useFormattedPrice(price),
        { initialProps: { price: 54.99 } }
      );

      expect(result.current).toBe('$54.99');

      rerender({ price: 89.99 });
      expect(result.current).toBe('$89.99');
    });
  });
});
