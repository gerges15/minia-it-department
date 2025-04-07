import { useState } from 'react';
import '../../styles/organisms/forms.css';

export default function Forms(props) {
  const [showForm, setShowForm] = useState(true);

  const toggleForm = e => {
    e.preventDefault();
    setShowForm(prev => !prev);
  };

  return (
    <div className={props.className}>
      <form className={`login-form  ${showForm ? 'show' : 'hide'}`}>
        <input type="text" placeholder="username" />
        <input type="password" placeholder="password" />
        <button>login</button>
        <p className="message">
          Forgot password?{' '}
          <a href="#" onClick={toggleForm}>
            Reset
          </a>
        </p>
      </form>
      {props.children}
      <form className={`password-form  ${!showForm ? 'show' : 'hide'}`}>
        <input type="password" placeholder="new password" />
        <input type="password" placeholder="conform password" />
        <input type="email" placeholder="email address" />
        <button>Conform</button>
        <p className="message">
          Already remember?{' '}
          <a onClick={toggleForm} href="#">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
