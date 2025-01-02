const multer = require("multer");
const { getMessage } = require("../lang");
const { ALLOWED_FILE_TYPES, FILE_SIZE } = require("../helpers/constant");

// Configure Multer with storage and validation
const storage = multer.memoryStorage(); // In-memory storage
const upload = multer({
  storage,
  limits: { fileSize: FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ALLOWED_FILE_TYPES;
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error(getMessage("multer.invalidFileType")));
    }
    // Accept the file
    cb(null, true);
  },
});

// Middleware for handling single file and form data
// Accept a single file under the key "file"
const uploadSingleFile = upload.single("file");

// Final middleware to handle file and form data
const formDataMiddleware = (req, res, next) => {
  uploadSingleFile(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.message, // Return the specific error
      });
    }
    next();
  });
};

module.exports = { formDataMiddleware };
