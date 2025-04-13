import React, { useState } from 'react';

import { login } from '../../API/auth';
import useAuthStore from '../store/useAuthStore';

import { useDispatch, useSelector } from 'react-redux';

export default function LoginRightSide(props) {
  const auth_store = useAuthStore();
  const dispatch = useDispatch();
  const password = useSelector(state => state.user.value.password);
  const userName = useSelector(state => state.user.value.name);

  const handleSubmit = async e => {
    e.preventDefault();
    const credentials = { userName, password };
    await login(credentials, dispatch, auth_store);
  };

  return (
    <div className="w-fit  p-6 md:p-5 flex items-center justify-center bg-white rounded-xl shadow-2xs ">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Log in</h1>
        <form onSubmit={handleSubmit}>{props.children}</form>
      </div>
    </div>
  );
}
