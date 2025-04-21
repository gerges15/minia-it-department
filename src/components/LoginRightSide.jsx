import React from 'react';

import { login } from '../services/auth';
import { useAuthStore, getRole } from '../store/useAuthStore';

export default function LoginRightSide(props) {
  const role = useAuthStore();

  const handleSubmit = async e => {
    e.preventDefault();

    await login(role);
  };

  return (
    <div className="w-fit  p-6 md:p-5 flex items-center justify-center bg-white rounded-xl shadow-2xs ">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Log in</h1>
        <form onSubmit={handleSubmit}>{props.children}</form>
        <p>Role:{getRole()}</p>
      </div>
    </div>
  );
}
