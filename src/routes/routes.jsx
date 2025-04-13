import { createBrowserRouter } from 'react-router';
import NotFound from '../pages/NotFound';
import ForgotPassword from '../pages/ForgotPassword';
import Login from '../pages/Login';
import HomePage from '../pages/HomePage';
import { Component } from 'react';

const rootRoute = {
  path: '/',
  errorElement: <NotFound />,
  children: [
    { index: true, Component: Login },
    { path: 'forgot-password', Component: ForgotPassword },
  ],
};

const loginRoute = {
  path: 'login',
  Component: Login,
};

const router = createBrowserRouter([rootRoute, loginRoute]);

export default router;
