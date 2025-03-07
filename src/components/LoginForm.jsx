import Container from "./Container";
import Input from "./Input";
import { userIdProps, passwordProps } from "../../public/Data/userData";

import "./LoginForm.css";
function LoginForm() {
  return (
    <Container className="login__form">
      <h1 className="login__form-header">Login</h1>
      <Input {...userIdProps} />
      <Input {...passwordProps} />

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
