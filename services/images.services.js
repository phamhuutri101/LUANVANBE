const cloudinary = require("../config/cloudinaryconfig");

class ImagesService {
  static uploadImage = async (file_path) => {
    const response = await cloudinary.uploader.upload(file_path, {
      folder: "test_folder",
    });
    const {
      public_id,
      asset_id,
      width,
      height,
      secure_url,
      original_filename,
    } = response;
    return {
      asset_id,
      width,
      height,
      secure_url,
      original_filename,
      public_id,
    };
    // return response;
  };
}

module.exports = ImagesService;
