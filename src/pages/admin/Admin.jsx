import "./Admin.css";
import SideBar from "./SideBar";
import Header from "./Header";
import Main from "./Main";
import Container from "../../components/Container";
import { RiAdminFill } from "react-icons/ri";

function Admin() {
  return (
    <div className="admin">
      <SideBar>
        <Container className="icon">
          <RiAdminFill size={50} />
          Admin
        </Container>
      </SideBar>
      <Header />
      <Main />
    </div>
  );
}

export default Admin;
