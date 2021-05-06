const path = require('path');
const { loadSync } = require('@grpc/proto-loader');
const { loadPackageDefinition, ServerCredentials, Server } = require('grpc');
const {
  listBlogs,
  createBlog,
  readBlog,
  updateBlog,
  deleteBlog
} = require('../services/server');

const { HOST_URL } = require('../config');

const blogProtoPath = path.join(__dirname, '..', 'protos', 'blog.proto');
const blogProtoDefinition = loadSync(blogProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const { BlogService: { service } } = loadPackageDefinition(blogProtoDefinition).blog;

function main() {
  const server = new Server();

  server.addService(service, {
    listBlogs,
    createBlog,
    readBlog,
    updateBlog,
    deleteBlog,
  });
  server.bind(HOST_URL, ServerCredentials.createInsecure());
  server.start();

  console.log(`Server Running at ${HOST_URL}`);
}

main();

