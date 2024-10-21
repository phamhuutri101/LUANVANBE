var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var FAVORITE = new Schema({
  USER_ID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  PRODUCT_ID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  IS_FAVORITE: {
    type: Boolean,
  },
  FROM_DATE: {
    type: Date,
  },
  TO_DATE: {
    type: Date,
  },
});
module.exports = mongoose.model("favorite", FAVORITE);
