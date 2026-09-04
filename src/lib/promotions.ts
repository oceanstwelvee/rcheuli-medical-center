// Discount % when old_price is a real markdown from price; null when there's
// no valid discount to show (old_price missing, or not greater than price).
export function computeDiscountPercent(
  price: number | null,
  oldPrice: number | null
): number | null {
  if (price == null || oldPrice == null) return null;
  if (oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
