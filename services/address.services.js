const AddressModel = require("../models/address");
const ObjectId = require("mongoose").Types.ObjectId;
class AddressService {
  static addAddress = async (user_id, province, district, commune, desc) => {
    const USER_ID = new ObjectId(user_id);
    try {
      let result;
      const checkFirstAddress = await AddressModel.findOne(
        {
          USER_ID: USER_ID,
          LIST_ADDRESS: {
            $elemMatch: {
              TO_DATE: null,
            },
          },
        },
        { USER_ID: 1 }
      ).lean();
      result = await AddressModel.updateOne(
        {
          USER_ID: USER_ID,
          LIST_ADDRESS_MAX_NUMBER: {
            $lt: 500,
          },
        },
        {
          $push: {
            LIST_ADDRESS: {
              PROVINCE: province,
              DISTRICT: district,
              COMMUNE: commune,
              DESC: desc,
              FROM_DATE: new Date(),
              TO_DATE: null,
              IS_DEFAULT: checkFirstAddress ? false : true,
            },
          },
          $inc: {
            LIST_ADDRESS_MAX_NUMBER: 1,
          },
        },
        {
          upsert: true,
        }
      );
      return result;
    } catch (error) {
      res.status(400).json(error);
    }
  };

  static updateAddress = async ({
    address_id,
    user_id,
    province,
    district,
    commune,
    desc,
  }) => {
    try {
      const ADDRESS_ID = new ObjectId(address_id);
      const USER_ID = new ObjectId(user_id);
      const update = await AddressModel.updateOne(
        {
          USER_ID: USER_ID,
        },
        {
          $set: {
            "LIST_ADDRESS.$[element].PROVINCE": province,
            "LIST_ADDRESS.$[element].DISTRICT": district,
            "LIST_ADDRESS.$[element].COMMUNE": commune,
            "LIST_ADDRESS.$[element].DESC": desc,
          },
        },
        {
          arrayFilters: [
            {
              "element.TO_DATE": null,
              "element._id": ADDRESS_ID,
            },
          ],
        }
      );
      return update;
    } catch (error) {
      console.log(error);
    }
  };
  static getAddress = async (user_id, page, limit) => {
    page = Number(page);
    limit = Number(limit);
    const USER_ID = new ObjectId(user_id);
    try {
      const addressUser = await AddressModel.aggregate([
        {
          $match: {
            USER_ID: USER_ID,
          },
        },
        { $unwind: "$LIST_ADDRESS" },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $group: {
            _id: "$USER_ID",
            LIST_ADDRESS_USER: {
              $push: "$LIST_ADDRESS",
            },
          },
        },
        { $unwind: "$LIST_ADDRESS_USER" },
        {
          $match: {
            "LIST_ADDRESS_USER.TO_DATE": null,
          },
        },
        {
          $replaceRoot: {
            newRoot: "$LIST_ADDRESS_USER",
          },
        },
      ]);
      return addressUser;
    } catch (error) {
      console.error(error);
      res.status(400).json(error);
    }
  };
  static deleteAddress = async (user_id, address_id) => {
    const USER_ID = new ObjectId(user_id);
    console.log(USER_ID);
    const ADDRESS_ID = new ObjectId(address_id);
    try {
      const updateResult = await AddressModel.updateOne(
        {
          USER_ID: USER_ID,
          LIST_ADDRESS: {
            $elemMatch: {
              _id: ADDRESS_ID,
            },
          },
        },
        {
          $set: { "LIST_ADDRESS.$[element].TO_DATE": new Date() },
        },
        {
          arrayFilters: [
            {
              "element._id": ADDRESS_ID,
            },
          ],
        }
      );

      if (updateResult.length == 0) {
        throw new Error("không còn địa chỉ nào để xóa");
      }
      return { message: "xóa địa chỉ thành công" };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  static getAddressByID = async (user_id, id_address) => {
    const USER_ID = new ObjectId(user_id);
    const ADDRESS_ID = new ObjectId(id_address);
    const getAddressId = AddressModel.findOne(
      {
        USER_ID: USER_ID,
      },
      {
        LIST_ADDRESS: {
          $elemMatch: {
            _id: ADDRESS_ID,
          },
        },
      }
    );
    return getAddressId;
  };
}
module.exports = AddressService;
