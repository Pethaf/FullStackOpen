import "./Loginform.css"
import { useState } from "react";
const Loginform = ({ handleLogin }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const login = (event) => {
    event.preventDefault();
    handleLogin(userName, password);
    setUserName("");
    setPassword("");
  };
  return (
    <form onSubmit={login}>
      <label htmlFor="username">
        Username:
        <input
          required
          id="username"
          type="text"
          placeholder="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </label>
      <label htmlFor="password">
        Password:
        <input
          required
          id="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit" disabled={!userName || !password}>
        Login
      </button>
    </form>
  );
};
export default Loginform;
