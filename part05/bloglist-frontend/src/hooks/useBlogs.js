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
      setBlogs([result.data, ...blogs]);
      return { success: true, message: `Blog ${result.data.title} by ${result.data.author} added` };
    } catch (error) {
      return { success: false, message: "Something went wrong while trying to post blog" };
    }
  };

  return { blogs, addBlog };
};

export default useBlogs;
