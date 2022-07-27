const express = require("express");
const passport = require("passport");
const upload = require("../../middleware/multer");
const router = express.Router();

const { fetchTicket, ticketCreate, getTickets, deleteTicket } = require("./tickets.controllers");

router.param("ticketId", async (req, res, next, ticketId) => { 
  const ticket = await fetchTicket(ticketId, next);
  if (ticket) {
    req.ticket = ticket;
    next();
  } else {
    const err = new Error("Ticket Not Found");
    err.status = 404;
    next(err);
  }
});

router.post(
  "/:spotId",
  passport.authenticate("userJWT", { session: false }),
  upload.single("image"),
  ticketCreate
);
router.get("/", getTickets);

router.delete("/delete/:ticketId", passport.authenticate("userJWT", { session: false }), deleteTicket);

module.exports = router;
