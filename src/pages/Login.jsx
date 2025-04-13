import React from 'react';
import LoginLeftSide from '../components/LoginLeftSide';
import LoginRightSide from '../components/LoginRightSide';

const LoginPage = () => {
  const LoginPageStyles = {
    container: 'flex h-screen  w-screen bg-[#f5f5f0]',
    login: 'flex justify-center w-full h-full',
  };

  return (
    <div className={LoginPageStyles.container}>
      <div className={LoginPageStyles.login}>
        <LoginLeftSide />
        <LoginRightSide />
      </div>
    </div>
  );
};

export default LoginPage;
