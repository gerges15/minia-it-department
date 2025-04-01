import "./Logo.css";
import logo from "../../assets/svg/Logos/Light_Logo_IT2.svg";
function Logo() {
  return (
    <div className="logo">
      <img className="logo-img" src={logo} alt="it logo" />
      <p>It Department</p>
    </div>
  );
}

export default Logo;
