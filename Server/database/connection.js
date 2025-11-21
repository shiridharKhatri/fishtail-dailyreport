const mongoose = require("mongoose");

const connectToDatbase = (URL) => {
  try {
    const connection = mongoose.connect(URL);
    return connection;
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToDatbase