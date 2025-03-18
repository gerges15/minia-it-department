import eyeRegular from "../../public/eye-regular.svg";
import eyeSlash from "../../public/eye-slash-regular.svg";

function EyeBtn({ handelShown, isShowed }) {
  return (
    <button className="btn" onClick={handelShown}>
      <img className="eye" src={isShowed ? eyeRegular : eyeSlash} />
    </button>
  );
}

export default EyeBtn;
