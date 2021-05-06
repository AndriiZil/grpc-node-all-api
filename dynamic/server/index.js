const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');

const greetProtoPath = path.join(__dirname, '..', 'protos', 'greet.proto');
const greetProtoDefinition = protoLoader.loadSync(greetProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const greetPackageDefinition = grpc.loadPackageDefinition(greetProtoDefinition).greet;

function greet(call, callback) {
  const firstName = call.request.greeting.first_name;
  const lastName = call.request.greeting.last_name;

  callback(null, { result: `Hello ${firstName} ${lastName}!`});

}

// streaming API
function greetManyTimes(call) {
  const firstName = call.request.greeting.first_name;
  const lastName = call.request.greeting.last_name;

  let count = 0;
  let intervalId = setInterval(() => {
    call.write({ result: JSON.stringify({ firstName, lastName }) });
    if (++count > 9) {
      clearInterval(intervalId);
      call.end();
    }
  }, 1000);
}

function main() {
  const server = new grpc.Server();

  server.addService(greetPackageDefinition.GreetService.service, { greet, greetManyTimes });
  server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('Server Running at http://127.0.0.1:50051');
}

main();
