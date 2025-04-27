import { createBrowserRouter } from 'react-router';
import { Outlet } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import ForgotPassword from '../pages/ForgotPassword';
import Login from '../pages/Login/Login';
import HomePage from '../pages/Home/HomePage';
import ProtectedRoute from '../utils/ProtectedRoute';
import ManageTimetable from '../pages/ManageTimetables';
import ManageCourses from '../pages/ManageCourses';
import ManageStudents from '../pages/ManageStudents';
import ManageTeachingStaff from '../pages/ManageTeachingStaff';
import ManageTeachingPlace from '../pages/ManageTeachingPlaces';

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
