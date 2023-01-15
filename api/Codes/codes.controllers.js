const Organizer = require("../../models/Organizer");
const Code = require("../../models/Code");

exports.getCodes = async (req, res, next) => {
  try {
    const codes = await Code.find();
    res.status(201).json(codes);
  } catch (err) {
    next(err);
  }
};

exports.codeCreate = async (req, res, next) => {
  try {
    const newCodes = await Code.create(req.body);
    await Organizer.findByIdAndUpdate(req.user._id, {
      $push: { codesBought: newCodes._id },
    });
    res.status(201).json(newCodes);
  } catch (error) {
    next(error);
  }
};

exports.fetchCode = async (codeId, next) => {
  try {
    const code = await Code.findById(codeId);
    return code;
  } catch (err) {
    next(err);
  }
};
