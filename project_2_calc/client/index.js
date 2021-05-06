const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const URL = '127.0.0.1:50051';
const protoFileUrl = '../protos/calculator.proto';

const packageDefinition = protoLoader.loadSync(protoFileUrl,{
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition);
const calculatorPackage = proto.calculator;
const client = new calculatorPackage.CalculatorService(URL, grpc.credentials.createInsecure());

function callSum() {
  const numbers = { first_number: 12, second_number: 13 };

  client.sum(numbers, (err, { result }) => {
    console.log(`The sum calculated on the server is: ${JSON.stringify(result)}`);
  });
}

function callPrimeNumberDecomposition() {
  const number = 567890;
  const request = { number };
  const call = client.primeNumberDecomposition(request, () => {});

  call.on('data', response => {
    console.log(`Prime Factors Found: ${response.prime_factor}`);
  });

  call.on('error', error => {
    console.error(error);
  })

  call.on('status', status => {
    console.log(status);
  });

  call.on('end', () => {
    console.log('Streaming Ended!');
  });
}

function callLongGreeting() {
  const request = { greet: { first_name: 'Andy', last_name: 'Riff' } };
  const call = client.longGreet(request, (err, response) => {
    if (!err) {
      console.log(`Server Response: ${response.result}`);
    } else {
      console.error(err);
    }
  });

  let count = 0;
  let intervalId = setInterval(() => {
    console.log(`Sending message ${count}`);
    call.write(request);

    if (++count > 3) {
      clearInterval(intervalId);
      call.end();
    }
  }, 1000);
}

function callComputeAverage() {
  const request = { number: 0 };

  const call = client.computeAverage(request, (err, response) => {
    if (err) {
      console.error(err);
    }
    console.log(`Response from Server ${response.average}`);
  });

  for (let i = 0; i < 10000; i++) {
    call.write({ number: i });
  }

  call.end();
}

async function sleep(interval) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), interval);
  });
}

async function callBiDirect() {
  const request = { greet: { first_name: 'John', last_name: 'Doe' } };

  const call = client.greetEveryOne(request, (error, response) => {
    console.log(`Server Response ${response}`);
  });

  call.on('data', (response) => {
    console.log(`Hello Client ${response.result}`);
  });

  call.on('error', error => {
    console.error(error);
  });

  call.on('end', () => {
    console.log('Client The End');
  });

  for (let i = 0; i < 10; i++) {
    const request = { greet: { first_name: 'Bob', last_name: 'Marley'} };
    call.write(request);
    await sleep(1000);
  }

  call.end();
}

async function callBiDiFindMaximum() {
  const request = { number: 5 };
  const call = client.findMaximum(request, () => {});

  call.on('data', response => {
    console.log(`Got max from Server ${response.maximum}`);
  });

  call.on('error', error => {
    console.error(error);
  });

  call.on('end', () => {
    console.log('Server is completed sending messages');
  });

  let data = [3, 5, 17, 9, 8, 30, 12, 29, 42, 37, 24, 36];

  for (let i = 0; i < data.length; i++) {
    const request = { number: data[i] };
    console.log(`Sending number ${data[i]}`);
    call.write(request);
    await sleep(1000);
  }

  call.end();
}

function doErrorCall() {
  const deadline = getRPCDeadline(2);
  const request = { number: -1 };

  client.squareRoot(request, { deadline }, (err, response) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Square root is ${JSON.stringify(response.number_root)}`);
  })
}

function getRPCDeadline(rpcType) {
  let timeAllowed = 5000;

  switch (rpcType) {
    case 1:
      timeAllowed = 1000;
      break;
    case 2:
      timeAllowed = 7000;
      break;
    default:
      console.log('Invalid RPC Type: Using Default Timeout');
  }

  return new Date(Date.now() + timeAllowed);
}

function main() {
  // callSum()
  // callPrimeNumberDecomposition();
  // callLongGreeting();
  // callComputeAverage();
  // callBiDirect().catch(console.error);
  // callBiDiFindMaximum().catch(console.error);
  doErrorCall();
}

main();
