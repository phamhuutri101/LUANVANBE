var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var INVENTORYENTRIES = new Schema({
  CRATED_DATE: {
    type: Date,
  },
  IS_DELETE: {
    type: Boolean,
    default: false,
  },
  LIST_PRODUCT_CREATED: [
    {
      ID_PRODUCT: {
        type: Schema.Types.ObjectId,
      },
      UNIT_PRICE: {
        type: Number,
      },
      QUANTITY: {
        type: Number,
        default: 0,
      },
      TOTAL_IMPORT_CONST: {
        type: Number,
      },
      DETAILS: {
        type: [
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
    },
  ],
  ID_SUPPLIERS: {
    type: Schema.Types.ObjectId,
  },
  ACCOUNT__ID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});
module.exports = mongoose.model("inventoryentries", INVENTORYENTRIES);
