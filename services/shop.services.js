const ShopModel = require("../models/shopInfo");
const AccountModel = require("../models/account");
const ProductModel = require("../models/product");
const ObjectId = require("mongoose").Types.ObjectId;
const moment = require("moment");
const { deleteOne } = require("../models/cart");

class ShopServices {
  static CheckTimeActive = async (
    id_account,
    id_user,
    name_shop,
    desc_shop
  ) => {
    try {
      const ACCOUNT_ID = new ObjectId(id_account);
      const USER_ID = new ObjectId(id_user);
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
      await ShopModel.create({
        ID_ACCOUNT: ACCOUNT_ID,
        ID_USER: USER_ID,
        SHOP_DESC: desc_shop,
        SHOP_NAME: name_shop,
        TO_DATE: new Date(),
        FROM_DATE: null,
      });

      return {
        message: "Chờ người kiểm duyệt, duyệt tài khoản",
        success: false,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };
  static activeShop = async (id_account) => {
    try {
      const ACCOUNT_ID = new ObjectId(id_account);
      await AccountModel.findOneAndUpdate(
        { _id: ACCOUNT_ID },
        {
          $set: {
            "OBJECT_ROLE.IS_SHOPPER": true,
          },
        }
      );

      const response = await ShopModel.updateOne(
        {
          ID_ACCOUNT: ACCOUNT_ID,
        },
        {
          $set: {
            IS_ACTIVE: true,
            FROM_DATE: new Date(),
          },
        }
      );
      return response;
    } catch (error) {
      console.error(error.message);
    }
  };
  static checkActiveShop = async (id_account) => {
    try {
      const ACCOUNT_ID = new ObjectId(id_account);

      // Tìm shop với ID_ACCOUNT tương ứng
      const shop = await ShopModel.findOne({
        ID_ACCOUNT: ACCOUNT_ID,
      });

      // Kiểm tra các trường hợp
      if (!shop) {
        return "undefined"; // Shop chưa được tạo
      }

      if (!shop.IS_ACTIVE) {
        return "nonActive"; // Shop đã tạo nhưng chưa active
      }

      return "active"; // Shop tồn tại và đã active
    } catch (error) {
      console.error(error);
      throw error; // Ném lỗi để xử lý ở tầng trên
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
  static getShopNonActive = async () => {
    try {
      const response = await ShopModel.find({
        IS_ACTIVE: false,
      });
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy shop:", error);
      throw error;
    }
  };
  static getNameShopByIdAccount = async (id_account) => {
    const ACCOUNT_ID = new ObjectId(id_account);
    try {
      const response = await ShopModel.findOne({
        ID_ACCOUNT: ACCOUNT_ID,
        IS_ACTIVE: true,
      });
      return response.SHOP_NAME;
    } catch (error) {
      console.error(error);
    }
  };
  static cancelActiveShop = async (id_account) => {
    try {
      const ACCOUNT_ID = new ObjectId(id_account);
      const response = await ShopModel.deleteOne({
        ID_ACCOUNT: ACCOUNT_ID,
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  };
  static getShop = async () => {
    try {
      const response = await ShopModel.find({});
      return response;
    } catch (error) {
      console.error(error);
    }
  };
}

module.exports = ShopServices;
