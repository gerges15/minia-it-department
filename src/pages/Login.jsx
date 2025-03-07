import Container from "../components/Container";
import { containerStyles } from "../../public/Data/styles";
import Logo from "../components/Logo";
import LoginForm from "../components/LoginForm";

export const Login = function () {
  return (
    <Container {...containerStyles}>
      <Logo />
      <LoginForm />
    </Container>
  );
};
