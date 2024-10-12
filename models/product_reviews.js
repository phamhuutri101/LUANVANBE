var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PRODUCT_REVIEWS = new Schema({
  ID_PRODUCT: {
    type: Schema.Types.ObjectId,
  },
  USER_ID: {
    type: Schema.Types.ObjectId,
  },
  NUMBER_OF_START: {
    type: Number,
  },
  NUMBER_OF_REVIEWS: {
    type: Number,
  },
  IMG_URL: {
    type: String,
  },
  REVIEW_CONTENT: {
    type: String,
  },
  LIST_MATCH_KEY: [
    {
      KEY: {
        type: String,
      },
      VALUE: {
        type: String,
      },
    },
  ],
});
module.exports = mongoose.model("product_reviews", PRODUCT_REVIEWS);
