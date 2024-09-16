var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PAYMENT_METHOD = new Schema({
  NAME_PAYMENT: {
    type: String,
  },
  CODE_PAYMENT: {
    type: String,
  },
});
module.exports = mongoose.model("payment_method", PAYMENT_METHOD);
