import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useRecentCoursesStore = create(
  persist(
    (set) => ({
      recentCourses: [],
      addOrUpdateCourse: (course) => {
        set((state) => {
          // Remove the course if it already exists (to avoid duplicates)
          const filteredCourses = state.recentCourses.filter(
            (c) => c.id !== course.id
          );

          // Add the new/updated course at the beginning
          const updatedCourses = [
            { ...course, updatedAt: new Date().toISOString() },
            ...filteredCourses,
          ].slice(0, 5); // Keep only the 5 most recent

          return { recentCourses: updatedCourses };
        });
      },
      setRecentCourses: (courses) => {
        set({ recentCourses: courses.slice(0, 5) });
      },
      clearRecentCourses: () => {
        set({ recentCourses: [] });
      },
    }),
    {
      name: 'recent-courses-storage', // unique name for localStorage key
      version: 1, // version number for potential future migrations
      partialize: (state) => ({ recentCourses: state.recentCourses }), // only persist recentCourses
    }
  )
);

export default useRecentCoursesStore; 