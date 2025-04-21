import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create(
  persist(
    set => ({
      isAuthenticated: false,
      role: '',

      setRole: theRole =>
        set({
          isAuthenticated: true,
          role: theRole,
        }),

      resetRole: () =>
        set({
          isAuthenticated: false,
          role: '',
        }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);
export const setRole = role => {
  useAuthStore.getState().setRole(role);
};
export const resetRole = () => {
  useAuthStore.getState().resetRole();
};
export const getRole = () => useAuthStore.getState().role;
