const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const { loadPackageDefinition, credentials } = require('grpc');

const blogProtoPath = path.join(__dirname, '..', 'protos', 'blog.proto');
const blogProtoDefinition = protoLoader.loadSync(blogProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const { BlogService } = loadPackageDefinition(blogProtoDefinition).blog;
const client = new BlogService('127.0.0.1:50051', credentials.createInsecure());

async function callListBlogs() {
  const request = {};
  const call = await client.listBlogs(request, () => {});

  call.on('data', response => {
    console.log(`Client Streaming Response ${JSON.stringify(response.blog)}`);
  });

  call.on('error', error => {
    console.error(error);
  });

  call.on('end', () => {
    console.log('Client End!');
  });
}

async function main() {
  await callListBlogs();
}

main().catch(console.error);
