import { create } from 'zustand';

export const useLogoutModalStore = create(set => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
