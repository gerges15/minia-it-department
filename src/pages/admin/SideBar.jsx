import { RiAdminFill, RiHome2Fill } from "react-icons/ri";
import "./Admin.css";
import { FaTable, FaEdit, FaBookOpen } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { MdManageHistory } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";

import "../admin/SideBar.css";
import Tab from "../../components/Tab";

export default function SideBar() {
  const largeIcon = 50;
  const smallIcon = 25;
  const iconColor = "#eff3ea";
  const iconProps = {
    size: smallIcon,
    color: iconColor,
    className: "tab-icon",
  };
  const tabLabels = [
    {
      label: "Home",
      icon: <RiHome2Fill {...iconProps} />,
    },
    {
      label: "Timetables",
      icon: <FaTable {...iconProps} />,
    },
    {
      label: "Manage",
      icon: <FaEdit {...iconProps} />,
    },

    {
      label: "Registration Rules",
      icon: <FaBookOpen {...iconProps} />,
    },
    {
      label: "Manage Hall/Lab",
      icon: <MdManageHistory {...iconProps} />,
    },
    {
      label: "Teaching Staff",
      icon: <FaUserCog {...iconProps} />,
    },
    {
      label: "Student",
      icon: <FaUserCog {...iconProps} />,
    },
    {
      label: "Logout",
      icon: <BiLogOut {...iconProps} />,
    },
  ];

  function handelLabel(e) {
    const headerLabel = document.querySelector(".header h1");
    if (!isIcon(e)) {
      clearTab(e);
      insertClass(e, "active-tab");
      replaceContext(headerLabel, e);
    }
  }

  function clearTab(e) {
    e.target
      .closest(".tabs")
      .querySelectorAll(".tab-item")
      .forEach((el) => {
        el.classList.remove("active-tab");
      });
  }

  function insertClass(e, aClassNames) {
    e.target.classList.add(`${aClassNames}`);
  }

  function replaceContext(anElement, e) {
    anElement.textContent = e.target.textContent;
  }

  function isIcon(e) {
    return e.target.nodeName == "svg" || e.target.nodeName == "path";
  }

  return (
    <aside className="sid-bar scroll">
      <div className="icon">
        <RiAdminFill size={largeIcon} />
        Admin
      </div>
      <ul className="tabs">
        {tabLabels.map((aTab) => (
          <Tab className="tab-item" handelLabel={handelLabel}>
            {aTab.icon}
            {aTab.label}
          </Tab>
        ))}
      </ul>
    </aside>
  );
}
