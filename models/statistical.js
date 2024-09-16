var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var STATISTICAL = new Schema({
  LIST_STATUS_STATISTICAL: {
    NOT_GIVE: {
      type: String,
    },
    DELIVERY: {
      type: String,
    },
    FROM_DATE: {
      type: String,
    },
    TO_DATE: {
      type: String,
    },
    ID_PRODUCT: {
      type: String,
    },
  },
  ACCOUNT__ID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});
module.exports = mongoose.model("statistical", STATISTICAL);
