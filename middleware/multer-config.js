const multer = require("multer");

const MIME_TYPE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

var splitterArray = [".jpeg", ".png", ".jpg"];

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    splitterArray.forEach((el) => {
     fileName = name.split(el);
    });
    const extension = MIME_TYPE[file.mimetype];
    callback(null, fileName[0] + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");
