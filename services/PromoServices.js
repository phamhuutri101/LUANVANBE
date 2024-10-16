const PromoModel = require("../models/PromoCode");
const moment = require("moment");

class PromoCodeService {
  static addPromoCode = async (
    code,
    discountAmount,
    discountPercentage,
    to_date,
    minPurchase
  ) => {
    const existingCode = await PromoModel.findOne({ code });
    if (existingCode) {
      return "Mã khuyến mãi đã tồn tại";
    }
    const formattedDate = moment(to_date, "DD/MM/YYYY").format("YYYY-MM-DD");
    const newPromo = new PromoModel({
      CODE: code,
      DISCOUNT_AMOUNT: discountAmount || null,
      DISCOUNT_PERCENTAGE: discountPercentage || null,
      TO_DATE: formattedDate,
      FROM_DATE: new Date(),
      ACTIVE: true,
      MIN_PURCHASE: minPurchase || 0,
    });
    const response = await newPromo.save();
    return response;
  };
  static checkPromoCode = async (code, orderTotal) => {
    const promo = await PromoModel.findOne({ CODE: code, ACTIVE: true });
    if (!promo) {
      throw new Error("Mã giảm giá không tồn tại hoặc không còn hiệu lực.");
    }
    const currentDate = moment();
    const toDate = moment(promo.TO_DATE);
    const fromDate = moment(promo.FROM_DATE);

    // Kiểm tra thời gian còn hiệu lực
    if (currentDate.isBefore(fromDate) || currentDate.isAfter(toDate)) {
      throw new Error("Mã giảm giá đã hết hạn hoặc chưa có hiệu lực.");
    }

    // Kiểm tra điều kiện đơn hàng tối thiểu
    if (orderTotal < promo.MIN_PURCHASE) {
      throw new Error(
        `Đơn hàng cần đạt tối thiểu ${promo.MIN_PURCHASE} để áp dụng mã giảm giá.`
      );
    }
    let discountValue = 0;
    if (promo.DISCOUNT_AMOUNT) {
      discountValue = promo.DISCOUNT_AMOUNT;
    } else if (promo.DISCOUNT_PERCENTAGE) {
      discountValue = (promo.DISCOUNT_PERCENTAGE / 100) * orderTotal;
    }
    return {
      discountValue,
      message: "Áp dụng mã giảm giá thành công.",
    };
  };
  static getAllPromoCodes = async () => {
    const promos = await PromoModel.find();
    return promos;
  };
}
module.exports = PromoCodeService;
