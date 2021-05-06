const path = require('path');
const { loadSync } = require('@grpc/proto-loader');
const { loadPackageDefinition, ServerCredentials, Server } = require('grpc');

require('../db');
const Blog = require('../models/Blog');

const blogProtoPath = path.join(__dirname, '..', 'protos', 'blog.proto');
const blogProtoDefinition = loadSync(blogProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const { BlogService: { service } } = loadPackageDefinition(blogProtoDefinition).blog;

async function listBlogs(call) {
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
}

function main() {
  const server = new Server();

  server.addService(service, { listBlogs });
  server.bind('127.0.0.1:50051', ServerCredentials.createInsecure());
  server.start();

  console.log('Server Running at http://127.0.0.1:50051');
}

main();

