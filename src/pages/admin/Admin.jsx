import { RiAdminFill, RiHome2Fill } from "react-icons/ri";
import "./Admin.css";
import SideBar from "./SideBar";
import Header from "./Header";
import Main from "./Main";
function Admin() {
  return (
    <div className="admin">
      <SideBar />
      <Header />
      <Main />
    </div>
  );
}

export default Admin;
