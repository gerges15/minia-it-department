import { useEffect, useState } from 'react';
import '../../styles/pages/Zlogin.css';
function Zlogin() {
  const [showForm, setShowForm] = useState(true);

  const toggleForm = e => {
    e.preventDefault();
    setShowForm(prev => !prev);
  };

  return (
    <div className="login-page">
      <div className="form">
        <form className={`register-form  ${showForm ? 'show' : 'hide'}`}>
          <input type="text" placeholder="name" />
          <input type="password" placeholder="password" />
          <input type="text" placeholder="email address" />
          <button>create</button>
          <p className="message">
            Already registered?{' '}
            <a onClick={toggleForm} href="#">
              Sign In
            </a>
          </p>
        </form>
        <form className={`login-form  ${!showForm ? 'show' : 'hide'}`}>
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
      </div>
    </div>
  );
}

export default Zlogin;
