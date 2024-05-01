const mongoose = require("mongoose");

const connect = async () => {
  mongoose.set("strictQuery", false);
  return mongoose.connect("mongodb://127.0.0.1:27017/gym");
};

module.exports = connect;