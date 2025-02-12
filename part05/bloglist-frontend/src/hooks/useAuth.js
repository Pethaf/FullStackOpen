import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import loginService from "../services/login";
import blogService from "../services/blogs";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkTokenExpiry = () => {
      const userAsJson = window.localStorage.getItem("loggedInBlogappUser");
      if (userAsJson) {
        const user = JSON.parse(userAsJson);
        const decodedToken = jwtDecode(user.token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          window.localStorage.removeItem("loggedInBlogappUser");
          setUser(null);
          blogService.setToken(null);
        } else {
          setUser(user);
          blogService.setToken(user.token);
        }
      }
    };

    checkTokenExpiry();
    const intervalId = setInterval(checkTokenExpiry, 300000);
    return () => clearInterval(intervalId);
  }, []);

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedInBlogappUser", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    window.localStorage.removeItem("loggedInBlogappUser");
    setUser(null);
    blogService.setToken(null);
  };

  return { user, login, logout };
};

export default useAuth;
