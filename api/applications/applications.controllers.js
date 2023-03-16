const { email } = require("../../middleware/email");
const Application = require("../../models/Application");

exports.fetchApplication = async (applicationId, next) => {
  try {
    const application = await Application.findById(applicationId);
    return application;
  } catch (error) {
    next(error);
  }
};

exports.applicationCreate = async (req, res, next) => {
  try {
    const newApplication = await Application.create(req.body);
    res.status(201).json(newApplication);
    return;
  } catch (error) {
    next(error);
  }
};
exports.applicationRemove = async (req, res, next) => {
  const { applicationId } = req.params;
  try {
    await Application.findByIdAndRemove({ _id: applicationId });
    res.status(204).end();
    return;
  } catch (error) {
    next(error);
  }
};

exports.getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find();
    res.json(applications);
    return;
  } catch (error) {
    next(error);
  }
};

exports.rejectionEmail = async (req, res, next) => {
  try {
    //TODO create an email for error scenarios
    // email(req.body.email, `Dest Application Rejected`, `Hello ${req.body.username}, Unfortunetly your Dest application has been Rejected, but you can always try again`)
    res.status(200).json("email sent succesfully");
    return;
  } catch (error) {
    next(error);
  }
};
