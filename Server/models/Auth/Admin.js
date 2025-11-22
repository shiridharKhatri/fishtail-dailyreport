const mongoose = require('mongoose')

const adminSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
    phone: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    department: {
      type: String,
      default: null,
    },     
    joinDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)


module.exports = mongoose.model("Admin", adminSchema)