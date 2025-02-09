import { useState } from "react";
import useAuth from "./hooks/useAuth";
import useBlogs from "./hooks/useBlogs";
import Displayblogs from "./components/Displayblogs";
import LoginForm from "./components/Loginform";
import NewBlogPost from "./components/NewBlogPost";
import DisplayFailure from "./components/DisplayFailure";
import DisplaySuccess from "./components/DisplaySuccess";
import "./App.css";

const App = () => {
  const { user, login, logout } = useAuth();
  const { blogs, addBlog } = useBlogs();
  const [showAddNewBlogPost, setShowAddNewBlogPost] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [failureMessage, setFailureMessage] = useState(null);
  const [loginButtonText, setLoginButtonText] = useState("Login");

  const displayMessage = (message, type) => {
    if (type === "success") {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 5000);
    } else {
      setFailureMessage(message);
      setTimeout(() => setFailureMessage(null), 5000);
    }
  };

  const handleLogin = async (username, password) => {
    const success = await login(username, password);
    if (!success) {
      setLoginButtonText("Couldn't login");
      setTimeout(() => setLoginButtonText("Login"), 2000);
    }
  };

  const handleSaveBlog = async (newBlogPost) => {
    const result = await addBlog(newBlogPost);
    displayMessage(result.message, result.success ? "success" : "error");
  };

  if(!user){
    return (
    <LoginForm 
      handleLogin={handleLogin}
      loginButtonText={loginButtonText}/>
    )
  }

  return (
    <div id="app-container">
      {showAddNewBlogPost ? (
        <NewBlogPost saveBlogFunction={handleSaveBlog} closeModalFunction={() => setShowAddNewBlogPost(false)} />
      ) : (
        <>
          <header>
            <h2>Blogs</h2>
            {failureMessage && <DisplayFailure message={failureMessage} />}
            {successMessage && <DisplaySuccess message={successMessage} />}
            <div className="user-panel">
              <p>{user.name} logged in</p>
              <button id="logout-button" onClick={logout}>Logout</button>
              <button id="add-blog-post-button" onClick={() => setShowAddNewBlogPost(true)}>+</button>
            </div>
          </header>
          <Displayblogs blogs={blogs} />
        </>
      )}
    </div>
  );
};

export default App;
