var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ACCOUNT = new Schema({
  USER_NAME: {
    type: String,
  },
  PASSWORD: {
    type: String,
  },
  OBJECT_ROLE: {
    IS_ADMIN: {
      type: Boolean,
      default: false,
    },
    IS_SHOPPER: {
      type: Boolean,
      default: false,
    },
    IS_USER: {
      type: Boolean,
      default: false,
    },
  },
  LIST_CODE_ACTIVE: [
    {
      CODE: {
        type: String,
      },
      IS_USING: {
        type: Boolean,
      },
      CREATED_AT: {
        type: Date,
      },
      TIME_USING: {
        type: Date,
      },
      TYPE: {
        type: String,
        enum: ["ACTIVE", "PASSWORD"],
      },
      EXP_DATE: {
        type: Date,
      },
    },
  ],
  IS_ACTIVE: {
    type: Boolean,
    default: false,
  },
  IS_LOCK: {
    type: Boolean,
    default: false,
  },
  USER_ID: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});
module.exports = mongoose.model("account", ACCOUNT);
