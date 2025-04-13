import React, { useState } from 'react';

import { login } from '../../API/auth';
import useAuthStore from '../store/useAuthStore';

import UserNameInput from './UserNameInput';
import PasswordInput from './PasswordInput';
import ForgotPasswordLink from './ForgotPasswordLink';
import SubmitButton from './SubmitButton';
import ErrMsg from './ErrMsg';
import { useDispatch } from 'react-redux';

export default function LoginRightSide() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const auth_store = useAuthStore();

  const handleSubmit = async e => {
    e.preventDefault();

    const credentials = { userName, password };

    await login(credentials, dispatch, auth_store, setIsLoading);
  };

  return (
    <div className="w-fit  p-6 md:p-5 flex items-center justify-center bg-white rounded-xl shadow-2xs">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Log in</h1>

        <form onSubmit={handleSubmit}>
          <UserNameInput />
          <PasswordInput />
          <ForgotPasswordLink />
          <ErrMsg />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
