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
const client = new greetPackageDefinition.GreetService('127.0.0.1:50051', grpc.credentials.createInsecure());

function callGreetings() {
  const request = {
    greeting: {
      first_name: 'Tom',
      last_name: 'Jerry'
    }
  }

  client.greet(request, (error, { result }) => {
    if (error) {
      return console.log(error);
    }
    console.log(result);
  })
}

function callGreetManyTimes() {
  const request = {
    greeting: {
      first_name: 'Josh',
      last_name: 'Shown'
    }
  }

  const call = client.greetManyTimes(request, () => {});

  call.on('data', (response) => {
    console.log(`Client Streaming Response ${response.result}`);
  });
  call.on('status', status => {
    console.log(status);
  });
  call.on('error', error => {
    console.error(error);
  });
  call.on('end', () => {
    console.log('Streaming Ended!');
  });
}

function main() {
  // callGreetings();
  callGreetManyTimes();
}

main();
