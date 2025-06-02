import { create } from 'zustand';
import { getStatistics } from '../../api/endpoints';

const useStatisticsStore = create((set) => ({
  statistics: {},
  isLoading: true,
  error: null,
  fetchStatistics: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await getStatistics();
      set({ statistics: data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useStatisticsStore; 