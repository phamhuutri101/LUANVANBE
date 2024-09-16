var mongoose = require("mongoose");
const { productSchema } = require("../validation/productValidator");
var Schema = mongoose.Schema;
var PRODUCT = new Schema({
  NAME_PRODUCT: {
    type: String,
  },
  SHORT_DESC: {
    type: String,
  },
  DESC_PRODUCT: {
    type: String,
  },
  NUMBER_INVENTORY_PRODUCT: {
    type: Number,
    default: 0,
  },
  CREATED_AT: {
    type: Date,
  },
  UPDATED_AT: {
    type: Date,
  },
  CATEGORY_ID: {
    type: Schema.Types.ObjectId,
    ref: "category",
  },
  LIST_PRODUCT_METADATA: [
    {
      KEY: {
        type: String,
      },
      VALUE: [
        {
          type: String,
        },
      ],
    },
  ],
  LIST_FILE_ATTACHMENT:[
  {
    FILE_URL: {
      type: String,
    },
    FILE_TYPE: {
      type: String,
    },
    FROM_DATE: {
      type: Date,
    },
    TO_DATE: {
      type: Date,
    },
    },
  ],
  LIST_FILE_ATTACHMENT_DEFAULT:[
  {
    FILE_URL: {
      type: String,
    },
    FILE_TYPE: {
      type: String,
    },
    FROM_DATE: {
      type: Date,
    },
    TO_DATE: {
      type: Date,
    },
    },
  ],
  ACCOUNT__ID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  IS_DELETED: {
    type: Boolean,
    default: false,
  },
  QUANTITY_BY_KEY_VALUE: [
    {
      QUANTITY: {
        type: Number,
        default: 0,
      },
      LIST_MATCH_KEY: [
        {
          KEY: {
            type: String,
          },
          VALUE:[
            {
            type: String,
            },
          ],  
        },
      ],
    },
  ],
});

PRODUCT.index(
  {
    NAME_PRODUCT: 'text',
    SHORT_DESC: 'text',
    DESC_PRODUCT: 'text'
  }
)
module.exports = mongoose.model("product", PRODUCT);
