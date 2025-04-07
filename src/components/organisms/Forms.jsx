import { useState } from 'react';
import '../../styles/organisms/forms.css';
import Form from '../molecules/Form';

export default function Forms(props) {
  const [showForm, setShowForm] = useState(true);

  const toggleForm = e => {
    e.preventDefault();
    setShowForm(prev => !prev);
  };

  return (
    <div className={props.className}>
      <Form
        className="login-form"
        toggleForm={toggleForm}
        showForm={showForm}
        buttonName="Login"
        messageP="Forgot password?"
        messageA="reset"
      >
        <input type="text" placeholder="username" />
        <input type="password" placeholder="password" />
      </Form>

      <Form
        className="password-form"
        toggleForm={toggleForm}
        showForm={!showForm}
        buttonName="Conform"
        messageP="Already remember?"
        messageA="Sign In"
      >
        <input type="password" placeholder="new password" />
        <input type="password" placeholder="conform password" />
        <input type="email" placeholder="email address" />
      </Form>

      {props.children}
    </div>
  );
}
