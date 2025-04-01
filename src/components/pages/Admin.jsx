import SideBar from "../templates/SideBar";
import Header from "../atoms/Header";
import Main from "../molecules/Main";
import Container from "../atoms/Container";
import Dashboard from "../templates/Dashboard";
import { RiAdminFill } from "react-icons/ri";
import Tab from "../atoms/Tab";
import Tabs from "../atoms/Tabs";
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
            <Tab
              id={aTab.id}
              key={aTab.label}
              className="tab-item"
              handelLabel={handelLabel}
            >
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
