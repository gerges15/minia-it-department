import { create } from "zustand";

const useSidebarStore = create((set, get) => ({
    isSidebarOpen: false,
    toggle: () => set({ isSidebarOpen: !get().isSidebarOpen })
}));

export default useSidebarStore;