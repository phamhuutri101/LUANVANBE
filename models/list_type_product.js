var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var LIST_TYPE_PRODUCT = new Schema({
  TYPE_PRODUCT: {
    type: String,
  },
  CREATE_DATE: {
    type: Date,
  },
  UPDATE_DATE: {
    type: Date,
  },
  IS_DELETED: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("list_type_product", LIST_TYPE_PRODUCT);
