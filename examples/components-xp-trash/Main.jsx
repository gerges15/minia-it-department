import "../../styles/molecules/Main.css";
import Input from "../atoms/Input";
import { useState } from "react";
export default function Main() {
  const [course, setCourse] = useState("");
  return (
    <main className="main">
      <div id="home-section" className="home section">
        <p>
          <span className="text--bold">First Name:</span> Girgis
        </p>
        <p>
          <span className="text--bold">Second Name:</span> Samy
        </p>
        <p>
          <span className="text--bold">Last Name:</span> Shafeq
        </p>
        <p>
          <span className="text--bold">Id:</span> 303032032
        </p>
        <p>
          <span className="text--bold">rol:</span> Admin
        </p>
        <p>
          <span className="text--bold">phone number:</span> 01288348198
        </p>
      </div>

      <section id="table-section" className="table section hide">
        <p>this is the table</p>
      </section>
      <section id="manage-section" className="manage section hide">
        <div className="course">
          <h3>Courses</h3>
          <div className="course_form">
            <Input label="Code" />
            <Input label="Case" />
            <input
              type="text"
              onChange={(e) => setCourse(e.target.value)}
            ></input>
          </div>
        </div>
        <p>current Value: {course}</p>
      </section>
    </main>
  );
}
