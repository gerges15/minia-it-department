import "./Admin.css";
import SideBar from "./SideBar";
import Header from "./Header";
import Main from "./Main";
import Container from "../../components/Container";
import Dashboard from "../../components/Dashboard";
import { RiAdminFill } from "react-icons/ri";
import Tab from "../../components/Tab";
import Tabs from "../../components/Tabs";
import { tabLabels } from "../../../public/Data/tabs";
import { handelLabel } from "../../../public/Data/handlerFunctions";

function Admin() {
  return (
    <Dashboard>
      <SideBar>
        <Container className="side-bar--header">
          <RiAdminFill size={50} />
          Admin
        </Container>

        <Tabs>
          {tabLabels.map((aTab) => (
            <Tab className="tab-item" handelLabel={handelLabel}>
              {aTab.icon}
              {aTab.label}
            </Tab>
          ))}
        </Tabs>
      </SideBar>

      <Header />
      <Main />
    </Dashboard>
  );
}

export default Admin;
