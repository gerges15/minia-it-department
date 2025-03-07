import Input from "../components/Input";
import "./Login.css";
import { userIdProps, passwordProps } from "../../public/Data/userData";
import Container from "../components/Container";
import { containerStyles } from "../../public/Data/styles";
import Logo from "../components/Logo";
export const Login = function () {
  return (
    <Container {...containerStyles}>
      <Logo />
      <Container className="login">
        <h1 className="login-header">Login</h1>
        <Input {...userIdProps} />
        <Input {...passwordProps} />

        <p className="forgot">
          <a href="" className="forgot-link">
            Forgot Password?
          </a>
        </p>

        <button className="login-btn">Let`s Go !</button>
      </Container>
    </Container>
  );
};
