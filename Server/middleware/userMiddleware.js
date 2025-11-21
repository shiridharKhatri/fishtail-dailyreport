const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

const userMiddlware = async(req, res, next) => {
  try {
    let token = await req.cookies["employee_token"];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.name = decoded.name
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = userMiddlware