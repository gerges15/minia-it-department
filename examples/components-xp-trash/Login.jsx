import Container from '../atoms/Container';
import { containerStyles } from '../../public/Data/styles';
import Logo from '../atoms/Logo';
import LoginForm from '../molecules/LoginForm';

export const Login = function () {
  return (
    <Container {...containerStyles} alignItems="center" margin="auto">
      <Logo />

      <LoginForm path="/admin" />
    </Container>
  );
};
