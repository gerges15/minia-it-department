import Input from "../components/Input";
import "./Login.css";
import { userIdProps, passwordProps } from "../../public/Data/userData";
import Container from "../components/Container";
import { containerStyles } from "../../public/Data/styles";
export const Login = function () {
  return (
    <Container {...containerStyles}>
      <div className="it">
        <img src="Logos/Light_Logo_IT2.svg" alt="it logo" />
        <p>It Department</p>
      </div>
      <form className="login">
        <h1>Login</h1>

        <Input {...userIdProps} />
        <Input {...passwordProps} />

        <p className="link">
          <a href="">Forgot Password?</a>
        </p>

        <button>Let`s Go !</button>
      </form>
    </Container>
  );
};
