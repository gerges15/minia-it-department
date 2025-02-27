import "./App.css";

function App() {
  return (
    <>
      <div className="it">
        <img src="Logos/Light_Logo_IT2.svg" alt="it logo" />
        <p>It Department</p>
      </div>
      <div className="login">
        <h1>Login</h1>
        <div>
          <p>Username</p>
          <input type="text" name="user-name" id="user-name" />
        </div>
        <div>
          <p>Password</p>
          <input type="password" name="user-name" id="user-name" />
        </div>
        <p className="link">
          <a href="">Forgot Password?</a>
        </p>

        <button>Let`s Go !</button>
      </div>
    </>
  );
}

export default App;
