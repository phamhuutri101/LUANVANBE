var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var LIST_TYPE_PRODUCT = new Schema({
  ID_TYPE: {
    type: String,
  },
  LIST_TYPE_PRODUCT: {
    type: String,
  },
});
module.exports = mongoose.model("list_type_product", LIST_TYPE_PRODUCT);
