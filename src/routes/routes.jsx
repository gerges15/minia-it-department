import { createBrowserRouter } from 'react-router';
import NotFound from '../pages/NotFound';
import ForgotPassword from '../pages/ForgotPassword';
import Admin from '../components/pages/Admin';

import Login from '../pages/Login';

const rootPage = {
  path: '/',
  errorElement: <NotFound />,
  children: [
    { index: true, Component: Login },
    { path: 'forgot-password', Component: ForgotPassword },
    { path: 'admin', Component: Admin },
  ],
};

const router = createBrowserRouter([
  rootPage,
  {
    path: 'admin',
    Component: Admin,
    children: [
      {
        index: true,
        element: <div>hello</div>,
      },
    ],
  },

  {
    // no component, just a path
    path: '/projects',
    children: [
      { index: true, Component: Admin },
      { path: ':pid', Component: Login },
      { path: ':pid/edit', Component: Admin },
    ],
  },
  {
    path: 'login',
    Component: Login,
  },
  {
    path: 'student',
    element: <h1>Hello this is the page of student</h1>,
  },
]);

export default router;
