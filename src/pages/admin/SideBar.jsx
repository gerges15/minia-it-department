import Tab from "../../components/Tab";
import Tabs from "../../components/Tabs";
import { tabLabels } from "../../../public/Data/tabs";
import { handelLabel } from "../../../public/Data/handlerFunctions";

import "../admin/SideBar.css";
import "./Admin.css";

export default function SideBar(props) {
  return (
    <aside className="sid-bar scroll">
      {props.children}

      <Tabs>
        {tabLabels.map((aTab) => (
          <Tab className="tab-item" handelLabel={handelLabel}>
            {aTab.icon}
            {aTab.label}
          </Tab>
        ))}
      </Tabs>
    </aside>
  );
}
