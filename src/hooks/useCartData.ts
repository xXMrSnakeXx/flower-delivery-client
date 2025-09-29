import { useMemo } from 'react';
import { useCartStore, type CartItem } from '../store/cartStore';

export function useCartData() {
  const items = useCartStore((s) => s.items);

  const totalPrice = useMemo(
    () =>
      items.reduce((acc, it) => acc + (it.priceCents || 0) * (it.qty || 0), 0),
    [items]
  );

  const groupedItems = useMemo(() => {
    return items.reduce<
      Record<string, { shopName: string; items: CartItem[] }>
    >((groups, item) => {
      const shopId = item.shopId ?? 'unknown';
      if (!groups[shopId]) {
        groups[shopId] = {
          shopName: item.shopName ?? 'Unknown Shop',
          items: [],
        };
      }
      groups[shopId].items.push(item);
      return groups;
    }, {});
  }, [items]);

  const isEmpty = !items || items.length === 0;

  return {
    items,
    totalPrice,
    groupedItems,
    isEmpty,
  };
}
