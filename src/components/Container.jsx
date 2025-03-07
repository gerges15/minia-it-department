function Container(props) {
  console.log(props);
  return (
    <div style={{ ...props }} className={props.className}>
      {props.children}
    </div>
  );
}

export default Container;
