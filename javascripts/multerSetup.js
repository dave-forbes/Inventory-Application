const path = require("path");
const multer = require("multer");

// Set up multer storage and specify the destination for uploaded files

const parentDir = path.resolve(__dirname, "..");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(parentDir, "public/images"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
