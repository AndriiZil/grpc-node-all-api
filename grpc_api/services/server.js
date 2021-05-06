const grpc = require('grpc');
const Blog = require('../models/Blog');
require('../db');

module.exports = {
  listBlogs: async (call) => {
    try {
      const blogs = await Blog.find().lean();

      for (let {_id: id, author, content, title } of blogs) {
        const response = { blog: { id, title, content, author }};
        call.write(response);
      }

      call.end();
    } catch (err) {
      console.error(err);
    }
  },
  createBlog: async (call, callback) => {
    try {
      const { author, title, content } = call.request.blog;
      const blog = await Blog.create({ author, title, content });
      const newBlogResponse = {
        blog: {
          id: blog._id,
          title: blog.title,
          content: blog.content,
          author: blog.author,
        }
      }

      console.log(`New blog "${blog._id}" was saved into DB`);
      callback(null, newBlogResponse);
    } catch (err) {
      console.error(err);
    }
  },
  readBlog: async (call, callback) => {
    try {
      const blogId = call.request.blog_id;
      const blog = await Blog.findById(blogId).lean();

      if (!blog) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: `Blog with id "${blogId}" was not found.`
        });
      }

      const { _id: id, title, author, content } = blog;
      const blogResponse = { blog: { id, title, author, content }};

      console.log(`Blog with id "${id}" was retrieved`);
      callback(null, blogResponse)
    } catch (err) {
      console.error(err);
    }
  },
  updateBlog: async (call, callback) => {
    try {
      const blogId = call.request.blog_id;
      const newContent = call.request.content;
      const options = { new: true };
      const blog = await Blog.findByIdAndUpdate(blogId, { content: newContent }, options);

      if (!blog) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: `Blog with id "${blogId}" was not found.`
        });
      }

      const { _id: id, title, author, content } = blog;
      const response = { blog: { id, title, author, content }};
      callback(null, response);
    } catch (err) {
      console.error(err);
    }
  },
  deleteBlog: async (call, callback) => {
    try {
      const blogId = call.request.blog_id;
      const blog = await Blog.findByIdAndDelete(blogId);

      const response = { blog_id: blogId };

      if (!blog) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: `Blog with id "${blogId}" was not found`,
        })
      }
      callback(null, response);
    } catch (err) {
      console.error(err);
    }
  }
};
