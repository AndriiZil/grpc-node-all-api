const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');

async function connectDb() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('DB Connected...');
  } catch (err) {
    console.log(err);
  }
}

connectDb().catch(console.error);
