import Blog from "./Blog";

const Displayblogs = ({ blogs }) => {
  return (
    <div className="blogs-container">
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default Displayblogs;
