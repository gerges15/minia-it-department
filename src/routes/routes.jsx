import { createBrowserRouter } from 'react-router';
import { Outlet } from 'react-router-dom';
import ForgotPassword from '../features/ForgotPassword';
import HomePage from '../features/Home/HomePage';
import Login from '../features/Login/Login';
import ManageCourses from '../features/ManageCourses';
import ManageDependencies from '../features/ManageDependencies';
import ManageStudents from '../features/ManageStudents';
import ManageTeachingPlace from '../features/ManageTeachingPlaces';
import ManageTeachingStaff from '../features/ManageTeachingStaff';
import ManageTimetable from '../features/TimeTable/ManageTimeTable';
import ManageSchedule from '../features/ManageSchedule';
import NotFound from '../features/NotFound';
import ProtectedRoute from '../utils/ProtectedRoute';
import StudentHome from '../components/students/StudentHome';
import StudentProfile from '../components/students/StudentProfile';
import StudentTimeTable from '../components/students/StudentTimeTableView';
import StaffProfile from '../components/staff/StaffProfile';
import AdminProfile from '../components/admin/ProfileOfAdmin';
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
      {
        path: 'admin-profile',
        element: <AdminProfile />,
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
