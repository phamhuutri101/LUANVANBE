var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CART = new Schema({
  USER_ID: {
    type: Schema.Types.ObjectId,
  },
  PRICE_REDUCED: {
    type: Number,
    default: 0,
  },
  SHIPPING_FEE: {
    type: Number,
    default: 0,
  },
  LIST_PRODUCT: [
    {
      ID_PRODUCT: {
        type: Schema.Types.ObjectId,
      },
      FROM_DATE: {
        type: Date,
      },
      TO_DATE: {
        type: Date,
      },
      QUANTITY: {
        type: Number,
        default: 1,
      },
      PRICE: {
        type: Number,
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
      NUMBER_PRODUCT: {
        type: Number,
        default: 0,
      },
      ID_KEY_VALUE: {
        type: Schema.Types.ObjectId,
      },
      ID_ACCOUNT_SHOP: {
        type: Schema.Types.ObjectId,
      },
    },
  ],

  LIST_PRODUCT_MAX_NUMBER: {
    type: Number,
  },
});
module.exports = mongoose.model("cart", CART);
