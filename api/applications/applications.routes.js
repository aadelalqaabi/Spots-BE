const express = require("express");
const router = express.Router();
const passport = require("passport");

const { fetchApplication, applicationCreate, getApplications, applicationRemove, rejectionEmail } = require("./applications.controllers");

router.param("applicationId", async (req, res, next, applicationId) => {
  const application = await fetchApplication(applicationId, next);
  if (application) {
    req.application = application;
    next();
  } else {
    const err = new Error("Application Not Found");
    err.status = 404;
    next(err);
  }
});

router.get("/", getApplications);
router.post("/create",applicationCreate);
router.post("/reject",rejectionEmail);
router.delete("/remove/:applicationId", passport.authenticate("orgJWT", { session: false }), applicationRemove);

module.exports = router;
