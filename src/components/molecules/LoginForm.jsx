import Container from "../atoms/Container";
import Input from "../atoms/Input";
import { userIdProps, passwordProps } from "../../../public/Data/userData";

import "../../styles/molecules/LoginForm.css";
import { useState } from "react";

import EyeBtn from "../atoms/EyeBtn";
import { NavLink } from "react-router";
function LoginForm({ path }) {
  const [isShowed, setShow] = useState(false);
  const [id, setValue] = useState("");

  function handelShown() {
    setShow(!isShowed);
  }

  function handelInput(e) {
    setValue(e.target.value);
  }

  return (
    <Container className="login__form">
      <h1 className="login__form-header">Login</h1>
      <Input
        {...userIdProps}
        getValue={handelInput}
        error={isValidId(id) ? "" : "error"}
      />
      <Input
        className="pass-input"
        {...passwordProps}
        type={isShowed ? "text" : "password"}
      >
        <EyeBtn handelShown={handelShown} isShowed={isShowed} />
      </Input>

      <p className="forgot">
        <a href="" className="forgot-link">
          Forgot Password?
        </a>
      </p>
      <NavLink to={path}>
        <button className="login__form-btn">Let`s Go !</button>
      </NavLink>
    </Container>
  );
}

function isValidId(ID) {
  const numbersOnly = /^[0-9]*$/;
  return numbersOnly.test(ID) && ID != "";
}
export default LoginForm;
