import Input from "../components/Input";
import "./Login.css";
export const Login = function () {
  const passwordProps = {
    id: "password",
    type: "password",
    label: "password",
    name: "user-password",
  };

  const userIdProps = {
    id: "id",
    type: "text",
    label: "userId",
    name: "user-id",
  };
  return (
    <>
      <div className="it">
        <img src="Logos/Light_Logo_IT2.svg" alt="it logo" />
        <p>It Department</p>
      </div>

      <form className="login">
        <h1>Login</h1>

        <Input {...userIdProps} />
        <Input {...passwordProps} />

        <p className="link">
          <a href="">Forgot Password?</a>
        </p>

        <button>Let`s Go !</button>
      </form>
    </>
  );
};
