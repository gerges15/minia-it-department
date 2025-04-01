import "../../styles/templates/SideBar.css";

export default function SideBar(props) {
  return <aside className="sid-bar scroll">{props.children}</aside>;
}
