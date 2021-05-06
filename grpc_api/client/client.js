const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const { loadPackageDefinition, credentials } = require('grpc');
const {
  callListBlogs,
  callCreateBlog,
  callReadBlog,
  callUpdateBlog,
  callDeleteBlog
} = require('../services/client');

const { HOST_URL } = require('../config');

const blogProtoPath = path.join(__dirname, '..', 'protos', 'blog.proto');
const blogProtoDefinition = protoLoader.loadSync(blogProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const { BlogService } = loadPackageDefinition(blogProtoDefinition).blog;
const client = new BlogService(HOST_URL, credentials.createInsecure());

async function main() {
  try {
    await callListBlogs(client);
    // await callCreateBlog(client);
    // await callReadBlog(client);
    // await callUpdateBlog(client);
    // await callDeleteBlog(client);
  } catch (err) {
    console.error(err);
  }
}

main().catch(console.error);
