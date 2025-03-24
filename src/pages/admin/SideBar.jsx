import "../admin/SideBar.css";
import "./Admin.css";

export default function SideBar(props) {
  return <aside className="sid-bar scroll">{props.children}</aside>;
}
