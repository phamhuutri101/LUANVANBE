var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var SUPPLIERS = new Schema({
  NAME_SUPPLIERS: {
    type: String,
  },
  ADDRESS_SUPPLIERS: {
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
  },
  CREATED_AT: {
    type: Date,
  },
  UPDATED_AT: {
    type: Date,
  },
  CODE_SUPPLIERS: {
    type: String,
  },
  IS_DELETED: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("suppliers", SUPPLIERS);
