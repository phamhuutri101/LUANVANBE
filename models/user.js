var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var USER = new Schema({
  FULL_NAME: {
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
  GENDER_USER: {
    type: String,
  },
  AVT_URL: {
    type: String,
  },
});
module.exports = mongoose.model("user", USER);
