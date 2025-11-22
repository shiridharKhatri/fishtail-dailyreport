const express = require("express");
const { login, getUserData, editUserData } = require("../controllers/userController");
const userMiddlware = require("../middleware/userMiddleware");

const router = express.Router();

router.post("/login", login);
router.get("/fetch", userMiddlware, getUserData)
router.put('/edit', userMiddlware, editUserData)

module.exports = router;
