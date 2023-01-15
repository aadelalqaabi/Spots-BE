const express = require("express");
const passport = require("passport");
const router = express.Router();

const { getCodes, codeCreate, fetchCode } = require("./codes.controllers");

router.param("codeId", async (req, res, next, codeId) => {
  const code = await fetchCode(codeId, next);
  if (code) {
    req.code = code;
    next();
  } else {
    const err = new Error("Code Not Found");
    err.status = 404;
    next(err);
  }
});

router.post(
  "/create",
  passport.authenticate("orgJWT", { session: false }),
  codeCreate
);

router.get("/", getCodes);

module.exports = router;
