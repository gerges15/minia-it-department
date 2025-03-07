import Container from "./Container";
import Input from "./Input";
import { userIdProps, passwordProps } from "../../public/Data/userData";

import "./LoginForm.css";
import { useState } from "react";
function LoginForm() {
  const [isShowed, setShow] = useState(false);

  function handelShown() {
    setShow(!isShowed);
  }

  return (
    <Container className="login__form">
      <h1 className="login__form-header">Login</h1>
      <Input {...userIdProps} />
      <Input {...passwordProps} type={isShowed ? "text" : "password"}>
        <button style={{ position: "absolute" }} onClick={handelShown}>
          {isShowed ? "Hide" : "Show"}
        </button>
      </Input>

      <p className="forgot">
        <a href="" className="forgot-link">
          Forgot Password?
        </a>
      </p>

      <button className="login__form-btn">Let`s Go !</button>
    </Container>
  );
}

export default LoginForm;
