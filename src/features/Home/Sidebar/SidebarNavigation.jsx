import { NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  FiHome,
  FiCalendar,
  FiBook,
  FiUsers,
  FiBriefcase,
  FiLink,
  FiClock,
  FiUser,
} from 'react-icons/fi';

import useSidebarStore from '../../../store/useSidebarStore';
import Cookies from 'js-cookie';

export default function SidebarNavigation() {
  const activeLinkStyle = 'bg-[#ede7f6] text-[#7e57c2] font-semibold';
  const defaultLinkStyle =
    'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
  const { toggle } = useSidebarStore();

  let decodedToken = jwtDecode(Cookies.get('accessToken'));
  let role = decodedToken.role;

  try {
    const token = Cookies.get('access_token');
    if (token) {
      decodedToken = jwtDecode(token);
      role = decodedToken?.role;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    window.location.href = '/login';
  }

  const adminNavigation = [
    { name: 'Admin Home', href: '/home', icon: FiHome },
    {
      name: 'Manage Timetables',
      href: '/manage-timetables',
      icon: FiCalendar,
    },
    { name: 'Manage Courses', href: '/manage-courses', icon: FiBook },
    { name: 'Manage Dependencies', href: '/manage-dependencies', icon: FiLink },
    { name: 'Manage Students', href: '/manage-students', icon: FiUsers },
    {
      name: 'Manage Teaching Staff',
      href: '/manage-teaching-staff',
      icon: FiUsers,
    },
    {
      name: 'Manage Teaching Places',
      href: '/manage-places',
      icon: FiBriefcase,
    },
    {
      name: 'Manage Schedules',
      href: '/manage-schedules',
      icon: FiClock,
    },
    {
      name: 'My Profile',
      href: '/admin-profile',
      icon: FiUser,
    },
  ];

  const teachingStaffNavigation = [
    { name: 'Staff Home', href: '/staff-home', icon: FiHome },
    { name: 'View Timetable', href: '/timetables', icon: FiCalendar },
    { name: 'My Profile', href: '/staff-profile', icon: FiUser },
  ];

  const studentsNavigation = [
    { name: 'Student Home', href: '/student-home', icon: FiHome },
    { name: 'View Timetable', href: '/student-timetable', icon: FiCalendar },
    { name: 'My Profile', href: '/student-profile', icon: FiUser },
  ];

  let navigation = [];
  switch (role) {
    case 'Admin':
      navigation = adminNavigation;
      break;
    case 'TeachingStaff':
      navigation = teachingStaffNavigation;
      break;
    case 'Student':
      navigation = studentsNavigation;
      break;
    default:
      navigation = [{ name: 'Home', href: '/', icon: FiHome }];
      break;
  }

  return (
    <nav className="mt-5 flex-1 px-2 space-y-1 overflow-y-auto">
      {navigation.map(item => (
        <NavLink
          key={item.name}
          to={item.href}
          end
          className={({ isActive }) =>
            `group flex items-center px-3 py-2.5 text-sm rounded-md transition-colors duration-150 ease-in-out ${
              isActive ? activeLinkStyle : defaultLinkStyle
            }`
          }
          onClick={() => toggle()}
        >
          <item.icon
            className="mr-3 flex-shrink-0 h-5 w-5"
            aria-hidden="true"
          />
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}
