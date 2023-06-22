const Popular = require("../../models/Popular");

exports.fetchPopular = async (popularId, next) => {
  try {
    const popular = await Popular.findById(popularId);
    return popular;
  } catch (error) {
    next(error);
  }
};

exports.popularCreate = async (req, res, next) => {
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }
  try {
    const newPopular = await Popular.create(req.body);
    res.status(201).json(newPopular);
    return;
  } catch (error) {
    next(error);
  }
};

exports.deletePopular = async (req, res, next) => {
  const { popularId } = req.params;
  try {
    await Popular.findByIdAndRemove({ _id: popularId });
    res.status(204).end();
    return;
  } catch (err) {
    next(err);
  }
};

exports.getPopulars = async (req, res, next) => {
  try {
    const populars = await Popular.find();
    res.json(populars);
    return;
  } catch (error) {
    next(error);
  }
};
