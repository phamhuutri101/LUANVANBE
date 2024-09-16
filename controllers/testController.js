const OrderService = require("../services/order.service");
const testController = {
  update: async (req, res, next) => {
    try {
      const response = await OrderService.statusOrder2COD(req.body.id);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
    }
  },
};
module.exports = testController;
