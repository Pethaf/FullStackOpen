import { useState, useEffect } from "react";
import blogService from "../services/blogs";

const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  
  useEffect(() => {
    blogService.getAll().then(setBlogs);
  }, []);

  const addBlog = async (newBlogPost) => {
    try {
      const result = await blogService.create(newBlogPost);
      setBlogs([...blogs,result]);
      return { success: true, message: `Blog ${result.title} by ${result.author} added` };
    } catch (error) {
      return { success: false, message: "Something went wrong while trying to post blog" };
    }
  };

  return { blogs, addBlog };
};

export default useBlogs;
