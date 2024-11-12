var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var DISCOUNT = mongoose.Schema({
  CODE: {
    type: String,
    required: true,
  },
  DISCOUNT_AMOUNT: {
    type: Number,
  }, // Số tiền giảm cố định
  ID_ACCOUNT: {
    type: Schema.Types.ObjectId,
  },
  DISCOUNT_PERCENTAGE: {
    type: Number,
  }, // Hoặc phần trăm giảm
  MAX_DISCOUNT_AMOUNT: {
    type: Number,
  },
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
  QUANTITY: {
    type: Number,
    default: 0,
  }, // Số lượng mã giảm giá còn lại
});
module.exports = mongoose.model("discount", DISCOUNT);
