const express = require("express");
const { login, getUserData, verifyUser } = require("../controllers/userController");
const userMiddlware = require("../middleware/userMiddleware");

const router = express.Router();

router.post("/login", login);
router.get("/fetch", userMiddlware, getUserData)
router.get('/verify', userMiddlware, verifyUser)

module.exports = router;
