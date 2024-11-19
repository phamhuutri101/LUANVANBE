const { boolean } = require("joi");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PRODUCT_REVIEWS = new Schema({
  ID_PRODUCT: {
    type: Schema.Types.ObjectId,
  },
  USER_ID: {
    type: Schema.Types.ObjectId,
  },
  ID_ORDER: {
    type: Schema.Types.ObjectId,
  },
  ID_ACCOUNT_SHOP: {
    type: Schema.Types.ObjectId,
  },
  NUMBER_OF_START: {
    type: Number,
  },
  IS_DELETE: {
    type: Boolean,
    default: false,
  },
  NUMBER_OF_REVIEWS: {
    type: Number,
  },
  REVIEW_DATE: {
    type: Date,
  },
  CLASSIFY: {
    type: String,
  },
  IMG_URL: [
    {
      FILE_URL: {
        type: String,
      },
    },
  ],

  REVIEW_CONTENT: {
    type: String,
  },
});
module.exports = mongoose.model("product_reviews", PRODUCT_REVIEWS);
