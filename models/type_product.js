var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var TYPE_PRODUCT = new Schema({
  TYPE_PRODUCT_CODE: {
    type: String,
  },
  TYPE_PRODUCT_NAME: {
    type: String,
  },
});
module.exports = mongoose.model("type_product", TYPE_PRODUCT);
