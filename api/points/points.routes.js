const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  fetchPoint,
  pointCreate,
  updatePoint,
  getPoints,
} = require("./points.controllers");

router.param("pointId", async (req, res, next, pointId) => {
  const point = await fetchPoint(pointId, next);
  if (point) {
    req.point = point;
    next();
  } else {
    const err = new Error("Point Not Found");
    err.status = 404;
    next(err);
  }
});

router.post(
  "/:spotId",
  passport.authenticate("userJWT", { session: false }),
  pointCreate
);
router.get("/", getPoints);

router.put(
  "/update/:pointId",
  passport.authenticate("userJWT", { session: false }),
  updatePoint
);

module.exports = router;
