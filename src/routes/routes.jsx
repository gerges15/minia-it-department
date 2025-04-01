import { createBrowserRouter } from "react-router";
import App from "../App";
import LoginForm from "../components/LoginForm";
import Admin from "../pages/admin/Admin";
const router = createBrowserRouter([
  {
    children: [
      { index: true, Component: LoginForm },
      { path: "admin", Component: Admin },
    ],
  },
  {
    path: "admin",
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
    path: "/projects",
    children: [
      { index: true, Component: Admin },
      { path: ":pid", Component: LoginForm },
      { path: ":pid/edit", Component: Admin },
    ],
  },
  {
    path: "login",
    Component: LoginForm,
  },
  {
    path: "student",
    element: <h1>Hello this is the page of student</h1>,
  },
]);

export default router;
