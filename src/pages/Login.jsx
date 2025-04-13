import React from 'react';
import LoginRightSide from '../components/LoginRightSide';
import { Provider } from 'react-redux';
import { loginStore } from '../state/store';
const LoginPage = () => {
  return (
    <Provider store={loginStore}>
      <div className="flex h-screen flex-col justify-center items-center  w-screen bg-[#f5f5f0]">
        <LoginRightSide />
      </div>
    </Provider>
  );
};

export default LoginPage;
