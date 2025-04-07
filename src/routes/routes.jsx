import { createBrowserRouter } from "react-router";
import { Login } from "../components/pages/Login";
import Zlogin from "../components/pages/Zlogin";
import Admin from "../components/pages/Admin";
const router = createBrowserRouter([
  {
    children: [
      { index: true, Component: Zlogin },
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
      { path: ":pid", Component: Login },
      { path: ":pid/edit", Component: Admin },
    ],
  },
  {
    path: "login",
    Component: Login,
  },
  {
    path: "student",
    element: <h1>Hello this is the page of student</h1>,
  },
]);

export default router;
