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
};
module.exports = InventoryController;
