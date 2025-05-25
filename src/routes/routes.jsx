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
import ManageTimetable from '../../src/features/Table/ManageTimetables';
import ManageSchedule from '../features/ManageSchedule';
import NotFound from '../../src/features/NotFound';
import ProtectedRoute from '../utils/ProtectedRoute';

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
      {
        path: 'manage-timetables',
        element: <ManageTimetable />,
      },
      {
        path: 'manage-courses',
        element: <ManageCourses />,
      },
      {
        path: 'manage-dependencies',
        element: <ManageDependencies />,
      },
      {
        path: 'manage-students',
        element: <ManageStudents />,
      },
      {
        path: 'manage-teaching-staff',
        element: <ManageTeachingStaff />,
      },
      {
        path: 'manage-places',
        element: <ManageTeachingPlace />,
      },
      {
        path: 'manage-schedules',
        element: <ManageSchedule />,
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
