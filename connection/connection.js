const mongoose = require("mongoose");

exports.ConnectMongo = async (url) => {
  return await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};
