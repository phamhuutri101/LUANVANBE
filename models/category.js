var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CATEGORY = new Schema({
  CATEGORY_NAME: {
    type: String
  },
  CREATED_AT: {
    type: Date
  },
  UPDATED_AT: {
    type: Date
  },
  TYPE_PRODUCT_ID: {
    type: Schema.Types.ObjectId
  }
});
module.exports = mongoose.model("category", CATEGORY);
