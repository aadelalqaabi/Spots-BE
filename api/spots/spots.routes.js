const express = require("express");
const passport = require("passport");
const upload = require("../../middleware/multer");
const router = express.Router();

const {
  getSpots,
  deleteSpot,
  updateSpot,
  fetchSpot,
  spotsCreate,
} = require("./spots.controllers");

router.param("spotId", async (req, res, next, spotId) => {
  const spot = await fetchSpot(spotId, next);
  if (spot) {
    req.spot = spot;
    next();
  } else {
    const err = new Error("Spot Not Found");
    err.status = 404;
    next(err);
  }
});

router.post(
  "/cat/:categoryId",
  passport.authenticate("orgJWT", { session: false }),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "galleryImage0", maxCount: 1 },
    { name: "galleryImage1", maxCount: 1 },
    { name: "galleryImage2", maxCount: 1 },
    { name: "galleryImage3", maxCount: 1 },
    { name: "galleryImage4", maxCount: 1 },
    { name: "adImage0", maxCount: 1 },
    { name: "adImage1", maxCount: 1 },
    { name: "adImage2", maxCount: 1 },
    { name: "adImage3", maxCount: 1 },
    { name: "adImage4", maxCount: 1 },
  ]),
  spotsCreate
);

router.delete(
  "/delete/:spotId",
  passport.authenticate("orgJWT", { session: false }),
  deleteSpot
);

router.put(
  "/update/:spotId/cat/:categoryId",
  passport.authenticate("orgJWT", { session: false }),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "galleryImage0", maxCount: 1 },
    { name: "galleryImage1", maxCount: 1 },
    { name: "galleryImage2", maxCount: 1 },
    { name: "galleryImage3", maxCount: 1 },
    { name: "galleryImage4", maxCount: 1 },
    { name: "adImage0", maxCount: 1 },
    { name: "adImage1", maxCount: 1 },
    { name: "adImage2", maxCount: 1 },
    { name: "adImage3", maxCount: 1 },
    { name: "adImage4", maxCount: 1 },
  ]),
  updateSpot
);

router.get("/", getSpots);

module.exports = router;
