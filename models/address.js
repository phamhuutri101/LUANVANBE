var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var USER_ADDRESS = new Schema({
  USER_ID: {
    type: Schema.Types.ObjectId,
  },
  LIST_ADDRESS: [
    {
      PROVINCE: {
        type: String,
      },
      DISTRICT: {
        type: String,
      },
      COMMUNE: {
        type: String,
      },
      DESC: {
        type: String,
      },
      FROM_DATE: {
        type: Date,
      },
      TO_DATE: {
        type: Date,
      },
      IS_DEFAULT: {
        type: Boolean,
      },
    },
  ],
  LIST_ADDRESS_MAX_NUMBER: {
    type: Number,
  },
});
module.exports = mongoose.model("user_address", USER_ADDRESS);
