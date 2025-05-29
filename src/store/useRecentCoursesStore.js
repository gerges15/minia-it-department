import { create } from 'zustand';

const useRecentCoursesStore = create((set) => ({
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
}));

export default useRecentCoursesStore; 