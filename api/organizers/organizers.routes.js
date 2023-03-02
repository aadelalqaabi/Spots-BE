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
  changePassword,
  forgotPassword,
  addDests,
  sendOrgToken,
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
router.post("/login", passport.authenticate("org", { session: false }), login);
router.put(
  "/update",
  upload.single("image"),
  passport.authenticate("orgJWT", { session: false }),
  updateOrganizer
);

router.get("/", getOrganizers);
router.put("/forgot", forgotPassword);
router.put(
  "/change",
  passport.authenticate("orgJWT", { session: false }),
  changePassword
);
router.put("/more", addDests);
router.post(
  "/updateToken",
  passport.authenticate("orgJWT", { session: false }),
  sendOrgToken
);
module.exports = router;
