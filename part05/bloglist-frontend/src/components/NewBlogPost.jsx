import { useState } from "react";
const NewBlogPost = ({ closeModalFunction, saveBlogFunction }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const handleSaveBlog = (event) => {
    event.preventDefault();
    saveBlogFunction({ title, author });
    closeModalFunction();
  };
  return (
    <div class="modal-wrapper">
      <div>
        <form onSubmit={handleSaveBlog}>
          <label htmlFor="title">
            Blog Title:
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="title"></input>
          </label>
          <label htmlFor="author">
            Author:
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              id="author"></input>
          </label>
          <button type="submit" disabled={!(title && author)}>
            Save Blog Post
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewBlogPost;
