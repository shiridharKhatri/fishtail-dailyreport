const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    picture: String,

    role: {
      type: String,
      enum: ["fulltime", "intern", "pending"],
      default: "pending",
    },

    department: {
      type: String,
      default: "general",
    },
    location: {
      type: String,
      default: "remote",
    },
    phone: {
      type: String,
      default: "",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    dateOfBirth: {
      type: Date,
    },

    // admin approval flag
    approved: {
      type: Boolean,
      default: false,
    },

    lastlogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
