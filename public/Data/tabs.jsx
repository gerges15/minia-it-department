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
