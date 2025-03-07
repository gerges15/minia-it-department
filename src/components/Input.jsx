function Input({ type, label, id, name }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input type={type} name={name} id={id} />
    </div>
  );
}

export default Input;
