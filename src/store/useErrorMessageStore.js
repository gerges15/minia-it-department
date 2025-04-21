import { create } from 'zustand';

export const useErrorMessageStore = create(set => ({
  errorMessage: '',
  setError: message => set({ errorMessage: message }),

  clearError: () => set({ errorMessage: '' }),
}));

export const setError = message => {
  useErrorMessageStore.getState().setError(message);
};

export const clearError = () => {
  useErrorMessageStore.getState().clearError();
};

export const getErrorMessage = () => {
  return useErrorMessageStore.getState().errorMessage;
};
