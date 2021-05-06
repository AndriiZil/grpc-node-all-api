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

function sum(call, callBack) {
  const num1 = Number(call.request.first_number);
  const num2 = Number(call.request.second_number);
  const result = num1 + num2;
  callBack(null, { result });
}

function primeNumberDecomposition(call) {
  let number = call.request.number;
  let divisor = 2;

  while (number > 1) {
    if (number % divisor === 0) {
      number = number / divisor;
      call.write({ prime_factor: divisor });
    } else {
      divisor++;
      console.log(`Divior has increase to ${divisor}`);
    }
  }

  call.end();
}

function longGreet(call, callback) {
  call.on('data', request => {
    const fullName = `${request.greet.first_name} ${request.greet.last_name}.`;
    console.log(`Hello ${fullName}`);
  });

  call.on('error', error => {
    console.error(error);
  });

  call.on('end', () => {
    callback(null, { result: 'Long Greet Client Streaming...'});
  });
}

function computeAverage(call, callback) {
  let sum = 0;
  let count = 0;

  call.on('data', request => {
    sum += request.number;
    console.log(`Got number ${request.number}`);
    count += 1;
  });

  call.on('error', error => {
    console.error(error);
  });

  call.on('end', () => {
    const average = sum / count;
    callback(null, { average });
  });
}

async function sleep(interval) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), interval);
  });
}

async function greetEveryOne(call, callback) {
  call.on('data', response => {
    const fullName = `${response.greet.first_name} ${response.greet.last_name}`;
    console.log(`Hello ${fullName}`);
  });

  call.on('error', error => {
    console.error(error);
  });

  call.on('end', () => {
    console.log('The End...');
  });

  for (let i = 0; i < 10; i++) {
    const request = { result: 'Antonio Rabeira' };
    call.write(request);
    await sleep(1000);
  }

  call.end(); // Finish sending messages
}

function findMaximum(call, callback) {
  let currentMaximum = 0;
  let currentNumber = 0;

  call.on('data', request => {
    currentNumber = request.number;
    if (currentNumber > currentMaximum) {
      currentMaximum = currentNumber;

      const response = { maximum: currentMaximum };
      call.write(response);
    }

    console.log(`Streamed number: ${request.number}`);
  });

  call.on('error', error => {
    console.error(error);
  });

  call.on('end', () => {
    const response = { maximum: currentMaximum };
    call.write(response);
    call.end();
    console.log('The End!');
  });
}

function squareRoot(call, callback) {
  const number = call.request.number;

  if (number >= 0) {
    const numberRoot = Math.sqrt(number);
    const response = { number_root: numberRoot };
    callback(null, response);
  } else {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: `The number send is not positive, ${number}`
    });
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(calculatorPackage.CalculatorService.service, {
    sum,
    longGreet,
    squareRoot,
    findMaximum,
    greetEveryOne,
    computeAverage,
    primeNumberDecomposition,
  });
  server.bindAsync(URL, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });

  console.log(`Server is running...`);
}

main();
