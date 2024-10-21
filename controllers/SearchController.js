const SearchProductServices = require("../services/search.services");
const SearchController = {
  searchProduct: async (req, res) => {
    try {
      const search = req.query.search;
      const products = await SearchProductServices.searchProduct(search);
      res.status(200).json({
        message: "Tìm kiếm sản phẩm thành công",
        success: true,
        data: products,
        total_rows: products.length,
        total_pages: Math.ceil(products.length / 10),
      });
    } catch (error) {
      res.status(500).json({
        message: "từ khóa không hợp lệ",
        message: error.message,
      });
    }
  },
};
module.exports = SearchController;
