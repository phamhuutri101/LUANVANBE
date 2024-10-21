const ProductModel = require("../models/product");
class SearchProductServices {
  static searchProduct = async (search) => {
    const products = await ProductModel.find({
      $text: { $search: search },
      IS_DELETED: false,
    });
    return products;
  };
}
module.exports = SearchProductServices;
