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
  NUMBER_FAVORITE: {
    type: Number,
  },
  FROM_DATE: {
    type: Date,
  },
  TO_DATE: {
    type: Date,
  },
});
module.exports = mongoose.model("favorite", FAVORITE);
