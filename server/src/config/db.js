const mongoose = require("mongoose");

const connect = async () => {
  mongoose.set("strictQuery", false);
  return mongoose.connect(process.env.MONGO_URI);
};

module.exports = connect;