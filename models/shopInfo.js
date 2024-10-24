var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var SHOP = mongoose.Schema({
  ID_ACCOUNT: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  SHOP_NAME: {
    type: String,
  },
  SHOP_DESC: {
    type: String,
  },
});
module.exports = mongoose.model("shop", SHOP);
