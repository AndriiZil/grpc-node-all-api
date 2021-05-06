const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const URL = '127.0.0.1:50051';
const protoFileUrl = '../protos/greet.proto';

const packageDefinition = protoLoader.loadSync(protoFileUrl,{
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition);
const greetPackage = proto.greet;

function main() {
  const client = new greetPackage.GreetService(URL, grpc.credentials.createInsecure());
  const greeting = { first_name: 'Andrii', last_name: 'Zilnyk'}

  client.greetUser({greeting}, (err, response) => {
    console.log(`Received from server ${JSON.stringify(response.result)}`);
  })
}

main();
