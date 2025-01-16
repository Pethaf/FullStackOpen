import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Displayblogs from "./components/Displayblogs";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Loginform from "./components/Loginform";
import NewBlogPost from "./components/NewBlogPost";
import DisplayFailure from "./components/DisplayFailure";
import DisplaySuccess from "./components/DisplaySuccess";
import "./App.css";
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [showAddNewBlogPost, setShowAddNewBlogPost] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [failureMessage, setFailureMessage] = useState(null);
  const [loginButtonText, setLoginButtonText] = useState("Login")
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
        blogService.setToken(null);
      } else {
        const user = JSON.parse(userAsJson);
        setUser(user);
        blogService.setToken(user.token);
      }
    }
  }, []);
  const displayError = (message) => {
    console.log("")
    setFailureMessage(message);
    setTimeout(() => {
      setFailureMessage(null);
    }, 5000);
  };
  const displaySuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const handleCancel = () => {
    setShowAddNewBlogPost(false);
  };
  const handleSaveBlog = async (newBlogPost) => {
    const result = await blogService.create(newBlogPost);
  };
  const handleLogout = () => {
    window.localStorage.removeItem("loggedInBlogappUser");
    setUser(null);
  };
  const closeNewBlogPostModal = () => {
    setShowAddNewBlogPost(false);
  };
  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedInBlogappUser", JSON.stringify(user));
      setUser(user);
    } catch (error) {
        setLoginButtonText("Couldn't login")
        setTimeout(() => {setLoginButtonText("Login")},2000)
    }
  };
  return (
    <div id="app-container">
      {showAddNewBlogPost ? (
        <NewBlogPost
          saveBlogFunction={handleSaveBlog}
          closeModalFunction={() => setShowAddNewBlogPost(false)}
          handleCancel={handleCancel}
        />
      ) : (
        <>
          <header>
            <h2>blogs</h2>
            {failureMessage && <DisplayFailure message={failureMessage} />}
            {successMessage && <DisplaySuccess message={successMessage} />}
            {user !== null && (
              <div className="user-panel">
                <p>{user.name} logged in</p>
                <div>
                  <button id="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                  <button
                    id="add-blog-post-button"
                    onClick={() => setShowAddNewBlogPost(true)}>
                    +
                  </button>
                </div>
              </div>
            )}
          </header>
          {user === null ? (
            <Loginform handleLogin={handleLogin} loginButtonText={loginButtonText}/>
          ) : (
            <Displayblogs blogs={blogs} />
          )}
        </>
      )}
    </div>
  );
};

export default App;
