const multer = require("multer");

const MIME_TYPE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

var splitterArray = [".jpeg", ".png", ".jpg"];

const storage = multer.diskStorage({
  // Set the destination of the files
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // Taking off the spaces of the fileName and the extension
    const name = file.originalname.split(" ").join("_");
    splitterArray.forEach((el) => {
     fileName = name.split(el);
    });
    const extension = MIME_TYPE[file.mimetype];
    // Create a new file name with the date 
    callback(null, fileName[0] + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");
