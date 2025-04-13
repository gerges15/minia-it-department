import React from 'react';
import { Provider } from 'react-redux';
import { loginStore } from '../state/store';

import LoginRightSide from '../components/LoginRightSide';
import UserNameInput from '../components/UserNameInput';
import PasswordInput from '../components/PasswordInput';
import ForgotPasswordLink from '../components/ForgotPasswordLink';
import SubmitButton from '../components/SubmitButton';
import ErrMsg from '../components/ErrMsg';
import LoginContainer from '../components/LoginContainer';
const LoginPage = () => {
  return (
    <Provider store={loginStore}>
      <LoginContainer>
        <LoginRightSide>
          <UserNameInput />
          <PasswordInput />
          <ForgotPasswordLink />
          <ErrMsg />
          <SubmitButton />
        </LoginRightSide>
      </LoginContainer>
    </Provider>
  );
};

export default LoginPage;
