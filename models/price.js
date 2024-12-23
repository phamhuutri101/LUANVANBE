const { boolean } = require("joi");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PRICE = new Schema({
  ID_PRODUCT: {
    type: Schema.Types.ObjectId,
  },
  LIST_PRICE_MAX_NUMBER: {
    type: Number,
  },
  ID_ACCOUNT: {
    type: Schema.Types.ObjectId,
  },
  IS_DELETE: {
    type: Boolean,
    default: false,
  },
  LIST_PRICE: [
    {
      PRICE_NUMBER: {
        type: Number,
      },
      FROM_DATE: {
        type: Date,
      },
      TO_DATE: {
        type: Date,
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
    },
  ],
});
module.exports = mongoose.model("price", PRICE);
