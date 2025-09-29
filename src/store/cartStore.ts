import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  name: string;
  priceCents: number;
  qty: number;
  imageUrl?: string;
  shopId: string;
  shopName?: string;
};

type CartState = {
  items: CartItem[];
  add: (
    productId: string,
    qty?: number,
    opt?: {
      name?: string;
      priceCents?: number;
      imageUrl?: string;
      shopId: string;
      shopName?: string;
    }
  ) => void;
  updateQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  setItems: (items: CartItem[]) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (productId, qty = 1, opt) => {
        if (qty <= 0) return;
        set((state) => {
          const idx = state.items.findIndex((i) => i.productId === productId);
          if (idx >= 0) {
            const items = state.items.slice();
            items[idx] = { ...items[idx], qty: items[idx].qty + qty };
            return { items };
          }

          if (!opt?.shopId) {
            console.error('shopId is required when adding item to cart');
            return state;
          }

          return {
            items: [
              ...state.items,
              {
                productId,
                qty,
                name: opt?.name ?? 'Item',
                priceCents: opt?.priceCents ?? 0,
                imageUrl: opt?.imageUrl,
                shopId: opt.shopId,
                shopName: opt?.shopName,
              },
            ],
          };
        });
      },

      updateQty: (productId, qty) => {
        if (qty <= 0) {
          get().remove(productId);
          return;
        }
        set((state) => {
          const idx = state.items.findIndex((i) => i.productId === productId);
          if (idx >= 0) {
            const items = state.items.slice();
            items[idx] = { ...items[idx], qty };
            return { items };
          }
          return state;
        });
      },

      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      clear: () => set({ items: [] }),

      setItems: (items) => set({ items }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.qty, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.priceCents * item.qty,
          0
        ),
    }),
    {
      name: 'flower.cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
