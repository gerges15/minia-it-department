import React from 'react';

import { login } from '../services/auth';

export default function LoginRightSide(props) {
  const handleSubmit = async e => {
    e.preventDefault();

    await login();
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
