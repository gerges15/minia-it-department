function Input({
  type,
  label,
  id,
  name,
  props,
  children,
  className,
  getValue,
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
        />
        {children}
      </div>
    </div>
  );
}

export default Input;
