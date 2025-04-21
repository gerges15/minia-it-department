import { create } from 'zustand';

export const useLoadingStore = create(set => ({
  isLoading: false,

  openLoading: () => {
    set({ isLoading: true });
  },
  disableLoading: () => {
    set({ isLoading: false });
  },
}));

export const openLoading = () => {
  useLoadingStore.getState().openLoading();
};
export const disableLoading = () => {
  useLoadingStore.getState().disableLoading();
};
