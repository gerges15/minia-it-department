import React from 'react';
import LoginLeftSide from '../components/LoginLeftSide';
import LoginRightSide from '../components/LoginRightSide';
import LoginForm from '../components/molecules/LoginForm';
const LoginPage = () => {
  return (
    <div className="flex h-screen  w-screen bg-[#f5f5f0]">
      <div className="flex justify-center w-full h-full">
        <LoginRightSide />
      </div>
    </div>
  );
};

export default LoginPage;
