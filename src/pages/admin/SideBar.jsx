import { RiAdminFill, RiHome2Fill } from "react-icons/ri";
import "./Admin.css";
import { FaTable, FaEdit, FaBookOpen } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { MdManageHistory } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { useEffect, useState } from "react";
import "../admin/SideBar.css";

export default function SideBar() {
  const largeIcon = 50;
  const smallIcon = 25;
  const mediumIcon = 37.5;
  const iconColor = "#eff3ea";
  const [isToggled, setToggler] = useState(false);

  function handelLabel(e) {
    const headerLabel = document.querySelector(".header h1");

    e.target.classList.add("active-tab");
    headerLabel.textContent = e.target.textContent;
  }

  return (
    <aside className="sid-bar scroll">
      <div className="icon">
        <RiAdminFill size={largeIcon} />
        Admin
      </div>
      <ul className="tabs">
        <li className="tab-item" onClick={handelLabel}>
          <RiHome2Fill
            size={smallIcon}
            color={iconColor}
            className="tab-icon"
          />
          Home
        </li>
        <li className="tab-item" onClick={handelLabel}>
          <FaTable size={smallIcon} color={iconColor} className="tab-icon" />
          Timetables
        </li>
        <li className="tab-item" onClick={handelLabel}>
          <FaEdit size={smallIcon} color={iconColor} className="tab-icon" />
          Manage
        </li>

        <li className="tab-item" onClick={handelLabel}>
          {" "}
          <FaBookOpen size={smallIcon} color={iconColor} className="tab-icon" />
          Registration rules
        </li>
        <li className="tab-item" onClick={handelLabel}>
          <MdManageHistory
            size={smallIcon}
            color={iconColor}
            className="tab-icon"
          />
          Mange Hall/Lab
        </li>
        <li className="tab-item" onClick={handelLabel}>
          <FaUserCog size={smallIcon} color={iconColor} className="tab-icon" />
          Teaching Staff
        </li>
        <li className="tab-item" onClick={handelLabel}>
          <FaUserCog size={smallIcon} color={iconColor} className="tab-icon" />
          Students
        </li>
        <li className="tab-item">
          <BiLogOut size={smallIcon} color={iconColor} className="tab-icon" />
          Logout
        </li>
      </ul>
    </aside>
  );
}
