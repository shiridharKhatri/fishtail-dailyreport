const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reportDate: {
      type: String,
      enum: ["today", "yesterday"],
      default: "today",
    },
    activity: {
      type: String,
      require: true,
    },
    hasAttachment: {
      type: Boolean,
      default: false,
    },
    attachment: {
      type: [String],
    },
    edited:{
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamp: true }
);


reportSchema.pre("save", function(next) {
  this.hasAttachment = this.attachment && this.attachment.length > 0;
  next();
});

module.exports = mongoose.model("Report", reportSchema);
