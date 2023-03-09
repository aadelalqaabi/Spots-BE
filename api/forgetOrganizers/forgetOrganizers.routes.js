const express = require("express");
const router = express.Router();
const passport = require("passport");

const { fetchForgetOrganizers, getForgetOrganizers, forgetOrganizerCreate, forgetOrganizerRemove } = require("./forgetOrganizers.controllers");

router.param("forgetOrganizersId", async (req, res, next, forgetOrganizersId) => {
  const forgetOrganizer = await fetchForgetOrganizers(forgetOrganizersId, next);
  if (forgetOrganizer) {
    req.forgetOrganizer = forgetOrganizer;
    next();
  } else {
    const err = new Error("Forget Organizer Not Found");
    err.status = 404;
    next(err);
  }
});

router.get("/", getForgetOrganizers);
router.post("/create/:email",forgetOrganizerCreate);
router.delete("/remove/:forgetOrganizersId", passport.authenticate("orgJWT", { session: false }), forgetOrganizerRemove);

module.exports = router;
