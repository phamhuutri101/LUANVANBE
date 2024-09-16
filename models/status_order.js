var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var STATUS_ODER = new Schema({
  STATUS_NAME: {
    type: String,
  },
  STATUS_CODE: {
    type: Number,
  },
  DECS: {
    type: String,
  },
});
module.exports = mongoose.model("status_order", STATUS_ODER);
