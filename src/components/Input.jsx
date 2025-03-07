function Input({ type, label, id, name, props, children }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input type={type} name={name} id={id} {...props} />
      {children}
    </div>
  );
}

export default Input;
