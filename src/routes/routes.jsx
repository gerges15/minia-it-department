import { createBrowserRouter } from 'react-router';
import { Outlet } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import ForgotPassword from '../pages/ForgotPassword';
import Login from '../pages/Login';
import HomePage from '../pages/HomePage';
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
]);

export default router;
