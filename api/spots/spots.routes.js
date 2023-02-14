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

const cpUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 5 },
]);

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
  cpUpload,
  //upload.single("image"),
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
  cpUpload,
  // upload.single("image"),
  updateSpot
);

router.get("/", getSpots);

module.exports = router;
