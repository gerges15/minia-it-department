import { RiAdminFill } from "react-icons/ri";
import Tab from "../../components/Tab";
import { tabLabels } from "../../../public/Data/tabs";
import "../admin/SideBar.css";
import "./Admin.css";

export default function SideBar() {
  const largeIcon = 50;
  function handelLabel(e) {
    const headerLabel = document.querySelector(".header h1");
    if (!isIcon(e)) {
      clearTab(e);
      insertClass(e, "active-tab");
      replaceContext(headerLabel, e);
    }
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
  const targetElement = e.target.nodeName;
  return (
    (targetElement == "svg" || targetElement == "path") && targetElement != "li"
  );
}
