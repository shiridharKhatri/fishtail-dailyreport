import mongoose from "mongoose";

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
      enum: ["full_time", "intern", "pending"],
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

export default mongoose.model("Employee", employeeSchema);
