const ShopModel = require("../models/shopInfo");
const AccountModel = require("../models/account");
const ProductModel = require("../models/product");
const ObjectId = require("mongoose").Types.ObjectId;
const moment = require("moment");

class ShopServices {
  static activeShop = async (id_account, name_shop) => {
    try {
      const ACCOUNT_ID = new ObjectId(id_account);

      // Lấy thông tin tài khoản
      const account = await AccountModel.findOne({ _id: ACCOUNT_ID });

      if (!account) {
        throw new Error("Không tìm thấy tài khoản.");
      }

      // Tìm mã kích hoạt đang sử dụng
      const activeCode = account.LIST_CODE_ACTIVE.find(
        (code) => code.IS_USING === true && code.TYPE === "ACTIVE"
      );

      if (!activeCode) {
        throw new Error("Không tìm thấy mã kích hoạt.");
      }

      // Lấy thời gian kích hoạt (TIME_USING)
      const timeUsing = moment(activeCode.TIME_USING);

      // Kiểm tra nếu thời gian kích hoạt chưa quá 1 ngày
      const currentTime = moment();
      const diffInDays = currentTime.diff(timeUsing, "days");

      if (diffInDays < 1) {
        throw new Error(
          "Tài khoản phải kích hoạt ít nhất 1 ngày mới được đăng ký người bán."
        );
      }
      const existingShop = await ShopModel.findOne({ ID_ACCOUNT: ACCOUNT_ID });
      if (existingShop) {
        throw new Error("Tài khoản này đã tạo shop trước đó.");
      }
      // Cập nhật tài khoản thành người bán
      await AccountModel.findOneAndUpdate(
        { _id: ACCOUNT_ID },
        {
          $set: {
            "OBJECT_ROLE.IS_SHOPPER": true,
          },
        }
      );

      await ShopModel.create({
        ID_ACCOUNT: ACCOUNT_ID,
        SHOP_NAME: name_shop,
      });

      return { message: "Kích hoạt tài khoản người bán thành công." };
    } catch (error) {
      throw new Error(error.message);
    }
  };
  static checkActiveShop = async (id_account) => {
    try {
      const ACCOUNT_ID = new ObjectId(id_account);

      const response = await ShopModel.findOne({
        ID_ACCOUNT: ACCOUNT_ID,
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  };
  static getShopByProductId = async (productId) => {
    try {
      const PRODUCT_ID = new ObjectId(productId);
      const response = await ProductModel.aggregate([
        {
          $match: {
            _id: PRODUCT_ID, // Tìm sản phẩm theo ID
          },
        },
        {
          $lookup: {
            from: "shops", // Tên collection của bảng Shop
            localField: "ACCOUNT__ID", // Trường dùng để nối từ bảng Product (ACCOUNT__ID)
            foreignField: "ID_ACCOUNT", // Trường dùng để nối từ bảng Shop (ID_ACCOUNT)
            as: "shop_info", // Tên biến lưu trữ kết quả của bảng Shop
          },
        },
        {
          $unwind: "$shop_info", // Tách mảng shop_info thành đối tượng
        },
        {
          $project: {
            _id: 0, // Không trả về _id của sản phẩm
            SHOP_NAME: "$shop_info.SHOP_NAME", // Trả về tên shop từ bảng Shop
          },
        },
      ]);

      if (response.length > 0) {
        return response[0].SHOP_NAME; // Trả về tên shop
      } else {
        throw new Error("Không tìm thấy shop cho sản phẩm này.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy tên shop:", error);
      throw error;
    }
  };
}

module.exports = ShopServices;
