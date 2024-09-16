const ImagesService = require("../services/images.services");
exports.uploadImages = async (req, res) => {
  try {
    const file = req.file.path;

    const response = await ImagesService.uploadImage(file);
    return res.status(200).json({
      message: "Uploaded images thành công!",
      success: true,
      data: {
        url: response.secure_url,
        type: response.original_filename.split("-")[0], //split là cách bởi dấu cách và lấy phân tử mảng đầu
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};
