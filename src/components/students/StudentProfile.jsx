import { useEffect, useState } from 'react';
import { FiUser, FiMail, FiCalendar, FiBook, FiUserCheck,FiCompass } from 'react-icons/fi';
import { getUserById } from '../../../api/endpoints';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default function StudentProfile() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    fullName: '',
    gender: 0,
    role: 2,
    level: 1,
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const decodedToken = jwtDecode(token);
        if (!decodedToken || !decodedToken.nameid) {
          throw new Error('Invalid token format');
        }

        const userId = decodedToken.nameid;
        console.log(userId);
        const response = await getUserById(userId);
        console.log(response);

        const profileData = response;
        setProfile(profileData);
        setError(null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getGenderText = (gender) => {
    return gender === 0 ? 'Male' : 'Female';
  };

  const getLevelText = (level) => {
    switch (Number(level)) {
      case 1: return 'First Year';
      case 2: return 'Second Year';
      case 3: return 'Third Year';
      case 4: return 'Fourth Year';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Student Profile</h1>
            <p className="text-gray-600 mt-1 text-sm">View your student account information.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-full">
            <FiCompass className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Student</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48 sm:h-64">
            <div className="text-red-600 text-center">
              <p className="text-lg font-semibold">Error Loading Profile</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <FiUser className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{profile.fullName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <FiUserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Username</p>
                  <p className="font-medium text-gray-900">{profile.userName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <FiUser className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-900">{getGenderText(profile.gender)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <FiCalendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-900">{profile.dateOfBirth}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <FiBook className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Level</p>
                  <p className="font-medium text-gray-900">{getLevelText(profile.level)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 