const { response } = require("express");
const Inventory_EntriesService = require("../services/inventory_entries.service");
const InventoryController = {
  addInventory_Entries: async (req, res) => {
    try {
      const newInventory_Entries =
        await Inventory_EntriesService.addInventory_Entries(
          req.params.id,
          req.body.price,
          req.body.quantity,
          req.body.key,
          req.body.value,
          req.body.id_supplier,
          req.user.id
        );
      await Inventory_EntriesService.updateInventoryProduct(
        req.params.id,
        req.body.key,
        req.body.value,
        req.body.quantity
      );

      await Inventory_EntriesService.updateNumberInventoryProduct(
        req.params.id
      );
      res.status(200).json({
        message: "Thêm phiếu nhập kho thành công",
        success: true,
        data: newInventory_Entries,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        success: false,
        data: null,
      });
    }
  },
  deleteInventory_Entries: async (req, res) => {
    try {
      const deleteInventory_Entries =
        await Inventory_EntriesService.deleteInventoryEntry(
          req.params.id,
          req.user.id
        );
      if (!deleteInventory_Entries) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy phiếu nhập kho." });
      }
      res.status(200).json({
        message: "Xóa phiếu nhập kho thành công",
        success: true,
        data: deleteInventory_Entries,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getInventory_Entries: async (req, res) => {
    try {
      const response = await Inventory_EntriesService.getInventory_Entries(
        req.user.id
      );
      res.status(200).json({
        message: "Lấy phiếu nhập kho thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        data: null,
        message: error.message,
      });
    }
  },
  getInventory_EntriesById: async (req, res) => {
    try {
      const response = await Inventory_EntriesService.getInventory_EntriesById(
        req.params.id,
        req.user.id
      );
      res.status(200).json({
        message: "Lấy phiếu nhập kho theo ID thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res
        .status(500)
        .json({ data: null, success: false, message: error.message });
    }
  },
  getInventory_EntriesByIdProduct: async (req, res) => {
    try {
      const response = await Inventory_EntriesService.getInventoryByIdProduct(
        req.params.id,
        req.user.id
      );
      res.status(200).json({
        message: "Lấy phiếu nhập kho theo ID sản phẩm thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },
};
module.exports = InventoryController;
