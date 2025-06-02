import { createBrowserRouter } from 'react-router';
import { Outlet } from 'react-router-dom';
import ForgotPassword from '../../src/features/ForgotPassword';
import HomePage from '../../src/features/Home/HomePage';
import Login from '../../src/features/Login/Login';
import ManageCourses from '../../src/features/ManageCourses';
import ManageDependencies from '../../src/features/ManageDependencies';
import ManageStudents from '../../src/features/ManageStudents';
import ManageTeachingPlace from '../../src/features/ManageTeachingPlaces';
import ManageTeachingStaff from '../../src/features/ManageTeachingStaff';
import ManageTimetable from '../../src/features/TimeTable/ManageTimeTable';
import ManageSchedule from '../features/ManageSchedule';
import NotFound from '../../src/features/NotFound';
import ProtectedRoute from '../utils/ProtectedRoute';
import StudentHome from '../components/students/StudentHome';
import StudentProfile from '../components/students/StudentProfile';
import StudentTimeTable from '../components/students/StudentTimeTableView';
import StaffProfile from '../components/staff/StaffProfile';
import StaffHome from '../components/staff/StaffHome';
import StaffTimeTableView from '../components/staff/StaffTimeTableView';

const RootLayout = () => <Outlet />;

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Login /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'login', element: <Login /> },
      {
        path: 'home',
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
    children: [
      // Admin Routes
      {
        path: 'manage-timetables',
        element: <ManageTimetable />,
        roles: ['Admin'],
      },
      {
        path: 'manage-courses',
        element: <ManageCourses />,
        roles: ['Admin'],
      },
      {
        path: 'manage-dependencies',
        element: <ManageDependencies />,
        roles: ['Admin'],
      },
      {
        path: 'manage-students',
        element: <ManageStudents />,
        roles: ['Admin'],
      },
      {
        path: 'manage-teaching-staff',
        element: <ManageTeachingStaff />,
        roles: ['Admin'],
      },
      {
        path: 'manage-places',
        element: <ManageTeachingPlace />,
        roles: ['Admin'],
      },
      {
        path: 'manage-schedules',
        element: <ManageSchedule />,
        roles: ['Admin'],
      },

      // Student Routes
      {
        path: 'student-home',
        element: <StudentHome />,
        roles: ['Student'],
      },
      {
        path: 'student-timetable',
        element: <StudentTimeTable />,
        roles: ['Student'],
      },
      {
        path: 'student-profile',
        element: <StudentProfile />,
        roles: ['Student'],
      },

      // Teaching Staff Routes
      {
        path: 'staff-home',
        element: <StaffHome />,
        roles: ['TeachingStaff'],
      },
      {
        path: 'timetables',
        element: <StaffTimeTableView />,
        roles: ['TeachingStaff'],
      },
      {
        path: 'staff-profile',
        element: <StaffProfile />,
        roles: ['TeachingStaff'],
      },

      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
