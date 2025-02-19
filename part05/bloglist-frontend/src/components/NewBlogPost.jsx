import { useState } from "react";
const NewBlogPost = ({ closeModalFunction, saveBlogFunction, handleCancel }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("")
  const handleSaveBlog = (event) => {
    event.preventDefault();
    saveBlogFunction({ title, author, url });
    closeModalFunction();
  };
  return (
    <div className="modal-wrapper">
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
          <label htmlFor="url">
            Url:
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              id="url"></input>
          </label>
          <button type="submit" disabled={!(title && author && url)}>
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
