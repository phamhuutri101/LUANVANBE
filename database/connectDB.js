const mongoose = require("mongoose");
const connectDB = () => {
  const password = encodeURIComponent("tttt2024group1#@");
  // const mongoConnect = `mongodb://internship_group_1:${password}@dtuct.ddns.net:6969/STORE_MANGAGER`;
  const mongoConnect = `mongodb://localhost:27017/`;

  mongoose
    .connect(mongoConnect, {})
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
    });
};
module.exports = connectDB;
