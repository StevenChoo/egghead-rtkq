import { useMemo } from 'react';

/**
 * Custom hook that formats a price number into a USD currency string.
 *
 * @param price - The price to format (can be number or string)
 * @param options - Optional Intl.NumberFormat options
 * @returns Formatted price string (e.g., "$54.99")
 *
 * @example
 * const formattedPrice = useFormattedPrice(54.99);
 * // Returns: "$54.99"
 */
export function useFormattedPrice(
  price: number | string,
  options?: Intl.NumberFormatOptions
): string {
  return useMemo(() => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

    if (isNaN(numericPrice)) {
      return '$0.00';
    }

    const defaultOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    };

    return new Intl.NumberFormat('en-US', defaultOptions).format(numericPrice);
  }, [price, options]);
}
