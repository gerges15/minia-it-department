import React from 'react';
import LoginRightSide from './LoginRightSide';
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
