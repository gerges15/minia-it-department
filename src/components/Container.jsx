function Container(props) {
  console.log(props);
  return <div style={{ ...props }}>{props.children}</div>;
}

export default Container;
