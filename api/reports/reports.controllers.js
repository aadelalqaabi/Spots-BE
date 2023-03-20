const Report = require("../../models/Report");

exports.fetchReport = async (reportId, next) => {
  try {
    const report = await Report.findById(reportId);
    return report;
  } catch (error) {
    next(error);
  }
};

exports.reportCreate = async (req, res, next) => {
  req.body.user = req.user._id;
  try {
    const newReport = await Report.create(req.body);
    res.status(201).json(newReport);
    return;
  } catch (error) {
    next(error);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().populate("user");
    res.json(reports);
    return;
  } catch (error) {
    next(error);
  }
};

exports.reportRemove = async (req, res, next) => {
  const { reportId } = req.params;
  try {
    await Report.findByIdAndRemove({ _id: reportId });
    res.status(204).end();
    return;
  } catch (error) {
    next(error);
  }
};