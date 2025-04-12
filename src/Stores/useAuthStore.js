import { create } from 'zustand';

const useAuthStore = create((set) => ({
    isAuthenticated: false,
    role: null,

    login: (role) =>
        set({
            isAuthenticated: true,
            role,
        }),

    logout: () =>
        set({
            isAuthenticated: false,
            role: null,
        }),
}));

export default useAuthStore;