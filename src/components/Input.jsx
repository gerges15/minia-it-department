function Input({ type, label, id, name, props, children, className }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div className={className}>
        <input type={type} name={name} id={id} {...props} />
        {children}
      </div>
    </div>
  );
}

export default Input;
