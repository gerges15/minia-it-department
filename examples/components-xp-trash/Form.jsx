import { useState } from 'react';

export default function Form(props) {
  return (
    <form className={`${props.className}  ${props.showForm ? 'show' : 'hide'}`}>
      {props.children}

      <button>{props.buttonName}</button>
      <p className="message">
        {props.messageP}{' '}
        <a href="#" onClick={props.toggleForm}>
          {props.messageA}
        </a>
      </p>
    </form>
  );
}
