const AddressService = require("../services/address.services");
const addressValidator = require("../validation/addressValidator");
const addressController = {
  addAddress: async (req, res, next) => {
    try {
      const { error } = addressValidator.validate(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }
      const addAddress = await AddressService.addAddress(
        req.user.id_user,
        req.body.provide,
        req.body.district,
        req.body.commune,
        req.body.desc
      );
      res.status(200).json({
        message: "thêm địa chỉ thành công",
        success: true,
        data: addAddress,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json(error);
    }
  },
  updateAddress: async (req, res, next) => {
    try {
      const addAddress = await AddressService.updateAddress({
        address_id: req.params.id,
        user_id: req.user.id_user,
        province: req.body.PROVIDE,
        district: req.body.DISTRICT,
        commune: req.body.COMMUNE,
        desc: req.body.DESC,
      });
      res.status(200).json(addAddress);
    } catch (error) {
      res.status(400).json(error);
    }
  },
  getAddressById: async (req, res, next) => {
    try {
      const findAddress = await AddressService.getAddressByID(
        req.user.id_user,
        req.params.id
      );
      res.status(200).json({
        message: "Lấy địa chỉ thành công",
        success: true,
        data: findAddress,
      });
    } catch (error) {
      res.status(400).json(error.messages);
    }
  },
  getAddress: async (req, res, next) => {
    try {
      const getAddressUser = await AddressService.getAddress(
        req.user.id_user,
        req.query.page,
        req.query.limit
      );
      res.status(200).json({
        message: "lấy địa chỉ thành công!",
        success: true,
        data: getAddressUser,
      });
    } catch (error) {
      res.status(400).json(error);
    }
  },
  deleteAddress: async (req, res, next) => {
    try {
      await AddressService.deleteAddress(req.user.id_user, req.params.id);
      res.status(200).json("xóa thành công");
    } catch (error) {
      res.status(400).json(error);
    }
  },
};
module.exports = addressController;
