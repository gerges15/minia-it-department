import { FiCalendar, FiUsers, FiBook, FiBriefcase } from 'react-icons/fi';
import { useEffect } from 'react';
import HomeStat from './HomeStat';
import useStatisticsStore from '../../store/useStatisticsStore';

export default function HomeQuickStats() {
  const { statistics, isLoading, fetchStatistics } = useStatisticsStore();

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <HomeStat
        color="text-blue-500"
        icon={FiUsers}
        name="Total Students"
        value={statistics.totalStudents}
        isLoading={isLoading}
      />

      <HomeStat
        color="text-green-500"
        icon={FiBook}
        name="Active Courses"
        value={statistics.totalCourses}
        isLoading={isLoading}
      />

      <HomeStat
        color="text-purple-500"
        icon={FiBriefcase}
        name="Teaching Staff"
        value={statistics.totalTeachingStaff}
        isLoading={isLoading}
      />

      <HomeStat
        color="text-orange-500"
        icon={FiCalendar}
        name="Classrooms"
        value={statistics.totalTeachingPlaces}
        isLoading={isLoading}
      />
    </div>
  );
}
