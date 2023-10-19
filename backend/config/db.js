const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Mongo DB Connected: ${conn.connection.host}`.green.underline);
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit();
  }
};

module.exports = connectDB;
