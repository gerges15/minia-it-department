import { create } from 'zustand';

export const useAuthStore = create(set => ({
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
}));

export const setRole = role => {
  useAuthStore.getState().setRole(role);
};
export const resetRole = () => {
  useAuthStore.getState().resetRole();
};
export const getRole = () => useAuthStore.getState().role;
