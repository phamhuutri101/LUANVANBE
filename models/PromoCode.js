const { types } = require("joi");
var mongoose = require("mongoose");
var DISCOUNT = mongoose.Schema({
  CODE: {
    type: String,
    required: true,
  },
  DISCOUNT_AMOUNT: {
    type: Number,
  }, // Số tiền giảm cố định
  DISCOUNT_PERCENTAGE: {
    type: Number,
  }, // Hoặc phần trăm giảm
  TO_DATE: {
    type: Date,
    required: true,
  },
  FROM_DATE: {
    type: Date,
    required: true,
  },
  MIN_PURCHASE: {
    type: Number,
  }, // Số tiền tối thiểu để áp dụng mã
  ACTIVE: {
    type: Boolean,
    default: true,
  }, // Trạng thái mã
});
module.exports = mongoose.model("discount", DISCOUNT);
