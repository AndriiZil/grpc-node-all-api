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

function greetUser(call, callBack) {
  callBack(null, { result: `Hello ${call.request.greeting.first_name} welcome to the world` });
}

function main() {

  const server = new grpc.Server();

  server.addService(greetPackage.GreetService.service, { greetUser });

  server.bindAsync(URL, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });

  console.log(`Server running...`);

}

main();
