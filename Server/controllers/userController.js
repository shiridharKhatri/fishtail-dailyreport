const jwt = require("jsonwebtoken");

const { oauth2client } = require("../util/googleConfig.js");
const Employee = require("../models/Auth/Employee.js");

const ALLOWED_DOMAIN = "@fishtailinfosolutions.com";

exports.login = async (req, res) => {
  try {
    const { code } = req.body;

    const googleResponse = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleResponse.tokens);

    const userRes = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`
    );
    const { id, email, name, picture } = await userRes.json();

    if (!email.endsWith(ALLOWED_DOMAIN)) {
      return res
        .status(403)
        .json({ success: false, message: `${ALLOWED_DOMAIN} is accepted.` });
    }

    let user = await Employee.findOne({ email });
    if (!user) {
      user = await Employee.create({
        googleId: id,
        email,
        name,
        picture,
      });
    }


    if (user.approved === false || user.role === "pending") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending approval. Please contact admin.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_TIMEOUT,
      }
    );

    return res
      .cookie("employee_token", token, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: user ? "Logged in" : "Account created and logged in",
        redirect: "/employee",
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while logging in",
      error: err.message,
    });
  }
};

exports.getUserData = async (req, res) => {
  try {
    let id = req.userId;
    let employee = await Employee.findById(id).select("-password");
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found with given id",
      });
    }

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    let id = req.userId;
    let user = await Employee.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    let data = {
      message: "Verified successfully",
      role: "employee",
      redirect: "/dashboard",
    };
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
