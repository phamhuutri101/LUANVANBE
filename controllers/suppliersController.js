const SuppliersService = require("../services/suppliers.service");
const suppliersController = {
  addSuppliers: async (req, res) => {
    try {
      const suppliers = await SuppliersService.addSuppliers(
        req.body.name_suppliers,
        req.body.province,
        req.body.district,
        req.body.commune,
        req.body.desc,
        req.body.code_supplier
      );
      res.status(200).json({
        message: "Thêm nhà cung cấp thành công",
        success: true,
        data: suppliers,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
  getSuppliers: async (req, res) => {
    try {
      const suppliers = await SuppliersService.getSuppliers();
      res.status(200).json({
        message: "Lấy nhà cung cấp thành công",
        success: true,
        data: suppliers,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
  getSuppliersById: async (req, res) => {
    try {
      const supplier = await SuppliersService.getSuppliersById(req.params.id);
      res.status(200).json({
        message: "Lấy nhà cung cấp thành công",
        success: true,
        data: supplier,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateSuppliers: async (req, res) => {
    try {
      const updateSuppliers = await SuppliersService.updateSuppliers(
        req.params.id,
        req.body.name_suppliers,
        req.body.province,
        req.body.district,
        req.body.commune,
        req.body.desc,
        req.body.code_supplier
      );
      res.status(200).json({
        message: "Cập nhật nhà cung cấp thành công",
        success: true,
        data: updateSuppliers,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
  deleteSuppliers: async (req, res) => {
    try {
      const deleteSuppliers = await SuppliersService.deleteSuppliers(
        req.params.id
      );
      res.status(200).json({
        message: "Xóa nhà cung cấp thành công",
        success: true,
        data: deleteSuppliers,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
};
module.exports = suppliersController;
