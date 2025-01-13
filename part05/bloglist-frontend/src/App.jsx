import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Displayblogs from "./components/Displayblogs";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Loginform from "./components/Loginform";
import "./App.css";
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  useEffect(() => {
    const userAsJson = window.localStorage.getItem("loggedInBlogappUser");
    if (userAsJson) {
      const user = JSON.parse(userAsJson);
      const decodedToken = jwtDecode(user.token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        window.localStorage.removeItem("loggedInBlogappUser");
        setUser(null);
      } else {
        const user = JSON.parse(userAsJson);
        setUser(user);
      }
    }
  }, []);
  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedInBlogappUser", JSON.stringify(user));
      setUser(user);
    } catch (error) {}
  };
  return (
    <div id="app-container">
      <header>
        <h2>blogs</h2>
        {user !== null && (
          <div className="user-panel">
            <p>{user.name} logged in</p>
            <button
              id="logout-button"
              onClick={() => {
                window.localStorage.removeItem("loggedInBlogappUser");
                setUser(null);
              }}>
              Logout
            </button>
          </div>
        )}
      </header>
      {user === null && <Loginform handleLogin={handleLogin} />}
      {user !== null && (
        <>
          <Displayblogs blogs={blogs} />
        </>
      )}
    </div>
  );
};

export default App;
