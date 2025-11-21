const { default: Employee } = require("../models/Auth/Employee.js");
const Report = require("../models/Report.js");

exports.postReport = async (req, res) => {
  try {
    const userId = req.userId;
    const { reportDate, activity } = req.body;
    
    let employee = await Employee.findById(userId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (employee.role === "pending" || employee.approved === false) {
      return res.status(403).json({
        success: false,
        message: "Your account is not approved to submit reports",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let submittedDate;

    if (reportDate === "today") {
      submittedDate = today;
    } else if (reportDate === "yesterday") {
      submittedDate = new Date(today);
      submittedDate.setDate(today.getDate() - 1);
    } else {
      submittedDate = new Date(reportDate);
      if (isNaN(submittedDate.getTime())) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid report date" });
      }
    }

    // Check if it's a future date
    if (submittedDate > today) {
      return res.status(400).json({
        success: false,
        message:
          "Whoa there, time traveler! You can't submit reports from the future",
      });
    }

    const attachment = req.files ? req.files.map((f) => f.filename) : [];

    const newReport = await Report.create({
      userId,
      reportDate,
      activity,
      attachment,
    });

    return res.status(201).json({
      success: true,
      data: newReport,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getReports = async (req, res) => {
  try {
    const userId = req.userId;

    const reports = await Report.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.editReport = async (req, res) => {
  try {
    let id = req.userId;
    let { reportId } = req.params;
    let { reportDate, activity } = req.body;

    let report = await Report.findOne({ _id: reportId, userId: id });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    if (report.reportDate === "yesterday") {
      return res.status(400).json({
        success: false,
        message: "Cannot edit yesterday's report",
      });
    }

    const attachment = req.files ? req.files.map((f) => f.filename) : [];

    report.reportDate = reportDate || report.reportDate;
    report.activity = activity || report.activity;
    if (attachment.length > 0) {
      report.attachment = attachment;
    }
    report.edited = true;
    report.editedAt = new Date();
    report.lastUpdatedAt = new Date();

    await report.save();

    return res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
