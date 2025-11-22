const multer = require("multer");
const fs = require("fs");
const path = require("path");
const express = require("express");
const userMiddlware = require("../middleware/userMiddleware");
const router = express.Router();
const { postReport, getReports, editReport } = require("../controllers/reportController");
const upload = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const username = req.name;
      const uploadPath = path.join(__dirname, "..", "images", username);

      fs.mkdir(uploadPath, { recursive: true }, (err) => {
        cb(err, uploadPath);
      });
    },

    filename: function (req, file, cb) {
      const uniqueSuffix =
        Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  const uploader = multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB per file
      files: 20,                 // allow up to 20 files
    },
  }).array("attachment", 20);

  uploader(req, res, (err) => {
    if (err) {
      // If file too large
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File is too large! Maximum allowed is 5MB.",
        });
      }

      // If too many files
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          success: false,
          message: "Too many files! Max 20 allowed.",
        });
      }

      return next(err);
    }
    next();
  });
};


router.post("/submit", userMiddlware, upload, postReport);
router.get("/getReports", userMiddlware, getReports);
router.put("/edit/:reportId", userMiddlware, upload, editReport);

module.exports = router;
