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
