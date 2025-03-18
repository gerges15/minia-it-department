import Logo from "../components/Logo";
import adminImg from "../../public/images/administrator.png";
import "./Admin.css";
function Admin() {
  return (
    <div className="admin">
      <aside className="sid-bar scroll">
        <div className="icon">
          <img src={adminImg} alt="" />
          Admin
        </div>
        <ul className="tabs">
          <li className="tab-item">Home</li>
          <li className="tab-item">Timetables</li>
          <li className="tab-item">Manage</li>
          <li className="tab-item">Registration rules</li>
          <li className="tab-item">Mange Hall/Lab</li>
          <li className="tab-item">Teaching Staff</li>
          <li className="tab-item">Students</li>
          <li className="tab-item">Logout</li>
        </ul>
      </aside>

      <header className="header">
        <nav>
          {" "}
          <h1>Admin Dashboard</h1>
        </nav>
      </header>
      <main className="main">
        <p>This is the main</p>
      </main>
    </div>
  );
}

export default Admin;
