import "./Login.css";
export const Login = function () {
  return (
    <>
      <div className="it">
        <img src="Logos/Light_Logo_IT2.svg" alt="it logo" />
        <p>It Department</p>
      </div>

      <form className="login">
        <h1>Login</h1>
        <div>
          <label htmlFor="user-name">Username</label>
          <input type="text" name="user-name" id="user-name" />
        </div>
        <div>
          <label htmlFor="user-password">Password</label>
          <input type="password" name="user-password" id="user-password" />
        </div>

        <p className="link">
          <a href="">Forgot Password?</a>
        </p>

        <button>Let`s Go !</button>
      </form>
    </>
  );
};
