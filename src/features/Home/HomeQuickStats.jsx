import { FiCalendar, FiUsers, FiBook, FiBriefcase } from 'react-icons/fi';
import { getStatistics } from '../../../api/endpoints';
import { useEffect, useState } from 'react';
import HomeStat from './HomeStat';

export default function HomeQuickStats() {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getStatistics();
        setStatistics(data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };
    fetchStatistics();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <HomeStat
        color="text-blue-500"
        icon={FiUsers}
        name="Total Students"
        value={statistics.totalStudents}
      />

      <HomeStat
        color="text-green-500"
        icon={FiBook}
        name="Active Courses"
        value={statistics.totalCourses}
      />

      <HomeStat
        color="text-purple-500"
        icon={FiBriefcase}
        name="Teaching Staff"
        value={statistics.totalTeachingStaff}
      />

      <HomeStat
        color="text-orange-500"
        icon={FiCalendar}
        name="Classrooms"
        value={statistics.totalTeachingPlaces}
      />
    </div>
  );
}
