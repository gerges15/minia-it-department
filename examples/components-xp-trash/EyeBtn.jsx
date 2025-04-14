import eyeSlash from "../../assets/svg/eye-slash-regular.svg";
import eyeRegular from "../../assets/svg/eye-regular.svg";

function EyeBtn({ handelShown, isShowed }) {
  return (
    <button className="btn" onClick={handelShown}>
      <img className="eye" src={isShowed ? eyeRegular : eyeSlash} />
    </button>
  );
}

export default EyeBtn;
