import { create } from 'zustand';

export const useUserStore = create(set => ({
  userName: '',
  userPassword: '',
  setUserName: theName => set({ userName: theName }),
  setPassword: password => set({ userPassword: password }),
}));

export const setUserName = theName => {
  useUserStore.getState().setUserName(theName);
};
export const setUserPassword = password => {
  useUserStore.getState().setPassword(password);
};

export const userName = () => useUserStore.getState().userName;
export const userPassword = () => useUserStore.getState().userPassword;
