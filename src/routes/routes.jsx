import { createBrowserRouter } from 'react-router';
import NotFound from '../pages/NotFound';
import ForgotPassword from '../pages/ForgotPassword';
import Login from '../pages/Login';
import HomePage from '../pages/HomePage';
import { Component } from 'react';
import { Outlet } from 'react-router-dom';
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
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
