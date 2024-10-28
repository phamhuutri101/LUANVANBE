var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var SHOP = mongoose.Schema({
  ID_ACCOUNT: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  ID_USER: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  SHOP_NAME: {
    type: String,
  },
  SHOP_DESC: {
    type: String,
  },
  IS_ACTIVE: {
    type: Boolean,
    default: false,
  },
  TO_DATE: {
    type: Date,
  },
  FROM_DATE: {
    type: Date,
  },
});
module.exports = mongoose.model("shop", SHOP);
