import Container from "./Container";
import Input from "./Input";
import { userIdProps, passwordProps } from "../../public/Data/userData";

import "./LoginForm.css";
import { useState } from "react";
import eyeRegular from "../../public/eye-regular.svg";
import eyeSlash from "../../public/eye-slash-regular.svg";
function LoginForm() {
  const [isShowed, setShow] = useState(false);

  function handelShown() {
    setShow(!isShowed);
  }
  const [inputValue, setValue] = useState("");

  function handelInput(e) {
    setValue(e.target.value);
  }
  console.log(inputValue);
  return (
    <Container className="login__form">
      <h1 className="login__form-header">Login</h1>
      <Input {...userIdProps} getValue={handelInput} />
      <Input
        className="pass-input"
        {...passwordProps}
        type={isShowed ? "text" : "password"}
      >
        <button className="btn" onClick={handelShown}>
          <img className="eye" src={isShowed ? eyeRegular : eyeSlash} />
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

function isValidId(ID) {
  const numbersOnly = /^[0-9]*$/;
  return numbersOnly.test(ID);
}
export default LoginForm;
