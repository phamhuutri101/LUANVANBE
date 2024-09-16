var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var USER = new Schema({
  FIRST_NAME: {
    type: String,
  },
  MIDDLE_NAME: {
    type: String,
  },
  FULL_NAME: {
    type: String,
  },
  LAST_NAME: {
    type: String,
  },
  EMAIL_USER: {
    type: String,
  },
  PHONE_NUMBER: {
    type: Number,
  },
  CREATED_AT: {
    type: Date,
  },
  GENGER_USER: {
    type: String,
  },
  AVT_URL: {
    type: String,
  },
});
module.exports = mongoose.model("user", USER);
