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
  "/cat/:categoryId", passport.authenticate("jwt", { session: false }), upload.single("image"), spotsCreate); 

router.delete("/:spotId", deleteSpot);

router.put("/:spotId", upload.single("image"), updateSpot);

router.get("/", getSpots);

module.exports = router;
