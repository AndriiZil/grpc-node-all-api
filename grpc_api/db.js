const mongoose = require('mongoose');

async function connectDb() {
  try {
    await mongoose.connect(`mongodb+srv://user:12345@cluster0.zxmde.mongodb.net/grpc?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('DB Connected...');
  } catch (err) {
    console.log(err);
  }
}

connectDb().catch(console.error);
