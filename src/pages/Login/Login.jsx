import React from 'react';
import LoginForm from './LoginForm';
import UserNameInput from './UserNameInput';
import PasswordInput from './PasswordInput';
import ForgotPasswordLink from './ForgotPasswordLink';
import SubmitButton from './SubmitButton';
import ErrMsg from '../../components/ErrMsg';
import LoginContainer from './LoginContainer';
import Logo from '../../components/Logo';

const LoginPage = () => {
  return (
    <LoginContainer>
      <Logo />
      <LoginForm>
        <UserNameInput />
        <PasswordInput />
        <ForgotPasswordLink />
        <ErrMsg />
        <SubmitButton />
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;
