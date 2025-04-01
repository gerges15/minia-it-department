import "../../styles/atoms/Tab.css";
export default function Tab({ style, className, children, handelLabel, id }) {
  return (
    <li
      id={id}
      style={{ ...style }}
      className={className}
      onClick={handelLabel}
    >
      {children}
    </li>
  );
}
