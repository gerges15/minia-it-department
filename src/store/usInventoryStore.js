import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create(
  persist(
    set => ({
      inventory: '',

      setInventory: inventory =>
        set({
          inventory,
        }),
    }),
    {
      name: 'inventory-storage',
      getStorage: () => localStorage,
    }
  )
);

export const setInventory = theInventory =>
  useAuthStore.getState().setInventory(theInventory);
export const getInventory = () => useAuthStore.getState().inventory;
