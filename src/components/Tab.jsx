export default function Tab({ style, className, children, handelLabel }) {
  return (
    <li style={{ ...style }} className={className} onClick={handelLabel}>
      {children}
    </li>
  );
}
