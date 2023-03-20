const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  fetchReport,
  reportCreate,
  getReports,
  reportRemove
} = require("./reports.controllers");

router.param("reportId", async (req, res, next, reportId) => {
  const report = await fetchReport(reportId, next);
  if (report) {
    req.report = report;
    next();
  } else {
    const err = new Error("Report Not Found");
    err.status = 404;
    next(err);
  }
});

router.post(
  "/create",
  passport.authenticate("userJWT", { session: false }),
  reportCreate
);
router.get("/", getReports);
router.delete("/remove/:reportId", passport.authenticate("orgJWT", { session: false }), reportRemove);

module.exports = router;
