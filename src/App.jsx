import { Outlet } from "react-router";
import "./App.css";

import Admin from "./pages/admin/Admin";
import { Login } from "./pages/Login";

function App() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
