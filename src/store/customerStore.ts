import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Customer = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  defaultAddress?: string | null;
  lastSeenAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
} | null;

type CustomerStore = {
  customer: Customer;
  favoriteIds: string[];
  hasHydrated: boolean;

  setCustomer: (patch: Partial<NonNullable<Customer>>) => void;
  replaceCustomer: (c: Customer) => void;
  clearCustomer: () => void;
  setHasHydrated: (v: boolean) => void;

  toggleFavorite: (id: string) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
};

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customer: null,
      favoriteIds: [],
      hasHydrated: false,

      setCustomer: (patch) =>
        set((state) => {
          const base = state.customer ?? {};
          const next: Customer = {
            ...base,
            ...patch,
            lastSeenAt: new Date().toISOString(),
          };
          return { customer: next };
        }),

      replaceCustomer: (c) => set(() => ({ customer: c })),

      clearCustomer: () => set(() => ({ customer: null })),

      setHasHydrated: (v) => set(() => ({ hasHydrated: v })),

      toggleFavorite: (id) => {
        const favs = get().favoriteIds;
        if (favs.includes(id)) {
          set({ favoriteIds: favs.filter((f) => f !== id) });
        } else {
          set({ favoriteIds: [...favs, id] });
        }
      },

      addFavorite: (id) => {
        const favs = get().favoriteIds;
        if (!favs.includes(id)) set({ favoriteIds: [...favs, id] });
      },

      removeFavorite: (id) =>
        set({ favoriteIds: get().favoriteIds.filter((f) => f !== id) }),

      clearFavorites: () => set({ favoriteIds: [] }),
    }),
    {
      name: 'customer-storage',
      partialize: (state) => ({
        customer: state.customer,
        favoriteIds: state.favoriteIds,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
