const ObjectId = require("mongoose").Types.ObjectId;
const PromoModel = require("../models/PromoCode");
const moment = require("moment");

class PromoCodeService {
  static addPromoCode = async (
    code,
    discountAmount,
    discountPercentage,
    to_date,
    minPurchase,
    id_account
  ) => {
    const existingCode = await PromoModel.findOne({ code });
    if (existingCode) {
      return null;
    }
    const ID_ACCOUNT = new ObjectId(id_account);
    const formattedDate = moment(to_date, "YYYY-MM-DD").format("YYYY-MM-DD");
    const newPromo = new PromoModel({
      CODE: code,
      ID_ACCOUNT: ID_ACCOUNT,
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
  static checkActivePromoCode = async (code) => {
    try {
      // Tìm mã giảm giá
      const promo = await PromoModel.find();

      // Kiểm tra nếu không tìm thấy mã
      if (!promo || promo.length === 0) {
        throw new Error("Mã giảm giá không tồn tại.");
      }

      const currentDate = new Date();
      let isValid = false;

      // Kiểm tra từng mã giảm giá
      for (const item of promo) {
        const toDate = new Date(item.TO_DATE);

        // Nếu đã hết hạn, cập nhật ACTIVE = false
        if (toDate < currentDate && item.ACTIVE) {
          await PromoModel.findByIdAndUpdate(
            item._id,
            { ACTIVE: false },
            { new: true }
          );
        }

        // Kiểm tra mã còn hiệu lực không
        if (toDate >= currentDate && item.ACTIVE) {
          const fromDate = new Date(item.FROM_DATE);
          if (currentDate >= fromDate) {
            isValid = true;
          }
        }
      }

      if (!isValid) {
        throw new Error("Mã giảm giá không còn hiệu lực.");
      }

      return promo;
    } catch (error) {
      throw error;
    }
  };
  static getAllPromoCodes = async (id_account, page = 1, limit = 10) => {
    page = Number(page);
    limit = Number(limit);
    const ID_ACCOUNT = new ObjectId(id_account);
    const promos = await PromoModel.aggregate([
      {
        $match: {
          ID_ACCOUNT: ID_ACCOUNT,
          ACTIVE: true,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);
    return promos;
  };
  static deletePromoCodes = async (id_account, id_promo) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    const ID_PROMO = new ObjectId(id_promo);
    const response = await PromoModel.updateOne(
      {
        _id: ID_PROMO,
        ID_ACCOUNT: ID_ACCOUNT,
      },
      {
        ACTIVE: false,
      }
    );
    if (!response) {
      throw new Error("Không tìm thấy mã giảm giá.");
    }
    return response;
  };
}
module.exports = PromoCodeService;
