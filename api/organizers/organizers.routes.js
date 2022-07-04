const express = require("express");
const passport = require("passport");
const upload = require("../../middleware/multer");
const router = express.Router();

const {
  register,
  login,
  getOrganizers,
  fetchOrganizer,
  updateOrganizer,
} = require("./organizers.controllers");

router.param("organizerId", async (req, res, next, organizerId) => {
  const organizer = await fetchOrganizer(organizerId, next);
  if (organizer) {
    req.organizer = organizer;
    next();
  } else {
    const err = new Error("Organizer Not Found");
    err.status = 404;
    next(err);
  }
});

router.post("/register", upload.single("image"), register);
router.post("/login", passport.authenticate("Org", { session: false }), login);
router.put(
  "/:organizerId/spots/:spotId",
  upload.single("image"),
  updateOrganizer
);
router.get("/", getOrganizers);
module.exports = router;
