const ForgetOrganizer = require("../../models/ForgetOrganizer");
const Organizer = require("../../models/Organizer");

exports.fetchForgetOrganizers = async (forgetOrganizersId, next) => {
  try {
    const forgetOrganizer = await ForgetOrganizer.findById(forgetOrganizersId);
    return forgetOrganizer;
  } catch (error) {
    next(error);
  }
};

exports.forgetOrganizerCreate = async (req, res, next) => {
  const { email } = req.params;
  console.log("email", email)
  try {
    const organizer = await Organizer.findOne({ email })
    if(organizer && organizer.email === email){
      const org = {
        email: organizer.email,
        phone: organizer.phone
      }
      const newForgetOrganizer = await ForgetOrganizer.create(org);
      res.status(201).json(newForgetOrganizer);
      return;
    }
    res.status(200).json("no Organizer Found");
    return;
  } catch (error) {
    next(error);
  }
};
exports.forgetOrganizerRemove = async (req, res, next) => {
  const { forgetOrganizersId } = req.params;
  try {
    await ForgetOrganizer.findByIdAndRemove({ _id: forgetOrganizersId });
    res.status(204).end();
    return;
  } catch (error) {
    next(error);
  }
};

exports.getForgetOrganizers = async (req, res, next) => {
  try {
    const forgetOrganizers = await ForgetOrganizer.find();
    res.json(forgetOrganizers);
    return;
  } catch (error) {
    next(error);
  }
};
