const calculateRevenueService = require("../services/calculateRevenue");
const calculateRevenueController = {
  calculateRevenue: async (req, res) => {
    try {
      const response = await calculateRevenueService.calculateOrderRevenue(
        req.params.id
      );
      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
module.exports = calculateRevenueController;
