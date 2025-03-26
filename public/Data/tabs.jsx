import { RiHome2Fill } from "react-icons/ri";
import { FaTable, FaEdit, FaBookOpen } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { MdManageHistory } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";

const iconProps = {
  size: "25px",
  color: "#eff3ea",
  className: "tab-icon",
};

export const tabLabels = [
  {
    label: "Home",
    icon: <RiHome2Fill {...iconProps} />,
    id: "home",
  },
  {
    label: "Timetables",
    icon: <FaTable {...iconProps} />,
    id: "table",
  },
  {
    label: "Manage",
    icon: <FaEdit {...iconProps} />,
    id: "manage",
  },

  {
    label: "Registration Rules",
    icon: <FaBookOpen {...iconProps} />,
    id: "rules",
  },
  {
    label: "Manage Hall/Lab",
    icon: <MdManageHistory {...iconProps} />,
    id: "lab",
  },
  {
    label: "Teaching Staff",
    icon: <FaUserCog {...iconProps} />,
    id: "teacher",
  },
  {
    label: "Student",
    icon: <FaUserCog {...iconProps} />,
    id: "student",
  },
  {
    label: "Logout",
    icon: <BiLogOut {...iconProps} />,
    id: "logout",
  },
];
