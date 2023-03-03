const multer = require("multer");

const MIME_TYPE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  // Set the destination of the files
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // Taking off the spaces of the fileName and the extension
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPE[file.mimetype];
    // Create a new file name with the date
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");
