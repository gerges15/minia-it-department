import { createBrowserRouter } from 'react-router';
import { Outlet } from 'react-router-dom';
import NotFound from '../features/NotFound';
import ForgotPassword from '../features/ForgotPassword';
import Login from '../features/Login/Login';
import HomePage from '../features/Home/HomePage';
import ProtectedRoute from '../utils/ProtectedRoute';
import ManageTimetable from '../features/ManageTimetables';
import ManageCourses from '../features/ManageCourses';
import ManageStudents from '../features/ManageStudents';
import ManageTeachingStaff from '../features/ManageTeachingStaff';
import ManageTeachingPlace from '../features/ManageTeachingPlaces';

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
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
