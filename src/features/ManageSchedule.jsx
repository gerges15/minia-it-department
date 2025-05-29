import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { FiCalendar, FiUsers, FiMapPin } from 'react-icons/fi';
import TeachingPlaceSchedules from '../components/ManageSchedule/TeachingPlaceSchedules';
import TeachingStaffSchedules from '../components/ManageSchedule/TeachingStaffSchedules';
import { getTeachingPlaces, getTeachingStaff } from '../../api/endpoints';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ManageSchedule() {
  const [teachingPlaces, setTeachingPlaces] = useState([]);
  const [teachingStaff, setTeachingStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch teaching places and staff in parallel
        const [placesResponse, staffResponse] = await Promise.all([
          getTeachingPlaces(),
          getTeachingStaff(0, '7', null, '') // Using level 7 (teaching lecturers) as default
        ]);

        // Handle paginated data - using results instead of data.items
        const places = placesResponse.results || [];
        const staff = staffResponse.results || [];

        setTeachingPlaces(places);
        setTeachingStaff(staff);
      } catch (error) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Schedules</h1>
        
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-purple-100 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-purple-700 shadow'
                    : 'text-purple-600 hover:bg-white/[0.12] hover:text-purple-800'
                )
              }
            >
              <div className="flex items-center justify-center space-x-2 cursor-pointer">
                <FiMapPin className="h-5 w-5" />
                <span>Teaching Places</span>
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-purple-700 shadow'
                    : 'text-purple-600 hover:bg-white/[0.12] hover:text-purple-800'
                )
              }
            >
              <div className="flex items-center justify-center space-x-2 cursor-pointer">
                <FiUsers className="h-5 w-5" />
                <span>Teaching Staff</span>
              </div>
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
                <div className="text-red-600 text-lg">{error}</div>
              </div>
            ) : (
              <>
                <Tab.Panel>
                  <TeachingPlaceSchedules teachingPlaces={teachingPlaces} />
                </Tab.Panel>
                <Tab.Panel>
                  <TeachingStaffSchedules teachingStaff={teachingStaff} />
                </Tab.Panel>
              </>
            )}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
