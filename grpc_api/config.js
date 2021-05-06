const dotenv = require('dotenv');

const env = dotenv.config({ path: '../.env'});

if (env.error) {
  console.error(env.error);
}

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  HOST_URL: process.env.HOST_URL,
};
