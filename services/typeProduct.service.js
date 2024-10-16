const TypeProductModel = require("../models/list_type_product");
class TypeProduct {
  static createTypeProduct = async (name_type) => {
    const response = await TypeProductModel.create({
      TYPE_PRODUCT: name_type,
      CREATED_AT: new Date(),
      UPDATED_AT: null,
      IS_DELETED: false,
    });
    return response;
  };
  static getAllTypeProducts = async () => {
    const response = await TypeProductModel.find({ IS_DELETED: false });
    return response;
  };
}
module.exports = TypeProduct;
