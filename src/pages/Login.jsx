import React from 'react';
import LoginRightSide from '../components/LoginRightSide';
import UserNameInput from '../components/UserNameInput';
import PasswordInput from '../components/PasswordInput';
import ForgotPasswordLink from '../components/ForgotPasswordLink';
import SubmitButton from '../components/SubmitButton';
import ErrMsg from '../components/ErrMsg';
import LoginContainer from '../components/LoginContainer';
import Logo from '../components/Logo';

const LoginPage = () => {
  return (
    <LoginContainer>
      <Logo />
      <LoginRightSide>
        <UserNameInput />
        <PasswordInput />
        <ForgotPasswordLink />
        <ErrMsg />
        <SubmitButton />
      </LoginRightSide>
    </LoginContainer>
  );
};

export default LoginPage;
