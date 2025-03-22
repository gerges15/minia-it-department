import Logo from "../components/Logo";

import { RiAdminFill, RiHome2Fill } from "react-icons/ri";
import "./Admin.css";
import { FaTable, FaEdit, FaBookOpen } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { MdManageHistory } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
function Admin() {
  const largeIcon = 50;
  const smallIcon = 25;
  const mediumIcon = 37.5;
  const iconColor = "#eff3ea";
  return (
    <div className="admin">
      <aside className="sid-bar scroll">
        <div className="icon">
          <RiAdminFill size={largeIcon} />
          Admin
        </div>
        <ul className="tabs">
          <li className="tab-item">
            <RiHome2Fill
              size={smallIcon}
              color={iconColor}
              className="tab-icon"
            />
            Home
          </li>
          <li className="tab-item">
            <FaTable size={smallIcon} color={iconColor} className="tab-icon" />
            Timetables
          </li>
          <li className="tab-item">
            <FaEdit size={smallIcon} color={iconColor} className="tab-icon" />
            Manage
          </li>

          <li className="tab-item">
            {" "}
            <FaBookOpen
              size={smallIcon}
              color={iconColor}
              className="tab-icon"
            />
            Registration rules
          </li>
          <li className="tab-item">
            <MdManageHistory
              size={smallIcon}
              color={iconColor}
              className="tab-icon"
            />
            Mange Hall/Lab
          </li>
          <li className="tab-item">
            <FaUserCog
              size={smallIcon}
              color={iconColor}
              className="tab-icon"
            />
            Teaching Staff
          </li>
          <li className="tab-item">
            <FaUserCog
              size={smallIcon}
              color={iconColor}
              className="tab-icon"
            />
            Students
          </li>
          <li className="tab-item">
            <BiLogOut size={smallIcon} color={iconColor} className="tab-icon" />
            Logout
          </li>
        </ul>
      </aside>

      <header className="header">
        <nav>
          {" "}
          <h1>Admin Dashboard</h1>
        </nav>
      </header>
      <main className="main">
        <h3>
          {" "}
          Lets go for a <RiAdminFill color="red" size={60} />?{" "}
        </h3>
      </main>
    </div>
  );
}

export default Admin;
