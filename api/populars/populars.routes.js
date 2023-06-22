const express = require("express");
const passport = require("passport");
const upload = require("../../middleware/multer");
const router = express.Router();

const {
  fetchPopular,
  popularCreate,
  getPopulars,
  deletePopular,
} = require("./populars.controllers");

router.param("popularId", async (req, res, next, popularId) => {
  const popular = await fetchPopular(popularId, next);
  if (popular) {
    req.popular = popular;
    next();
  } else {
    const err = new Error("Popular Not Found");
    err.status = 404;
    next(err);
  }
});

router.post(
  "/create",
  passport.authenticate("orgJWT", { session: false }),
  upload.single("image"),
  popularCreate
);
router.get("/", getPopulars);

router.delete(
  "/delete/:popularId",
  passport.authenticate("orgJWT", { session: false }),
  deletePopular
);

module.exports = router;
