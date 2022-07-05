const Category = require("../../models/Category");

exports.fetchCategory = async (categoryId, next) => {
  try {
    const category = await Category.findById(categoryId);
    return category;
  } catch (error) {
    next(error);
  }
};

exports.categoryCreate = async (req, res, next) => {
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }
  
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate("spots");
    res.json(categories);
  } catch (error) {
    next(error);
  }
};
