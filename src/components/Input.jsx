function Input({
  type,
  label,
  id,
  name,
  props,
  children,
  className,
  getValue,
  error,
}) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div className={className}>
        <input
          type={type}
          typ
          name={name}
          id={id}
          {...props}
          onChange={getValue}
          className={error}
        />
        {children}
      </div>
    </div>
  );
}

export default Input;
