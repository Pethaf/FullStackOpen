import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Loginform from "./components/Loginform";
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  useEffect(() => {
    const userAsJson = window.localStorage.getItem("loggedInBlogappUser");
    if (userAsJson) {
      const user = JSON.parse(userAsJson)
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
    <div>
      <h2>blogs</h2>
      {user === null && <Loginform handleLogin={handleLogin} />}
      {user !== null && blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
    </div>
  );
};

export default App;
