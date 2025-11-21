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
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  multer({ storage }).array("attachment", 20)(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

router.post("/submit", userMiddlware, upload, postReport);
router.get("/getReports", userMiddlware, getReports);
router.put("/edit/:reportId", userMiddlware, upload, editReport);

module.exports = router;
