const Ticket = require("../../models/Ticket");
const Spot = require("../../models/Spot");
const User = require("../../models/User");

exports.fetchTicket = async (ticketId, next) => {
  try {
    const ticket = await Ticket.findById(ticketId);
    return ticket;
  } catch (error) {
    next(error);
  }
};

exports.ticketCreate = async (req, res, next) => {
  const { spotId } = req.params;
  req.body.spot = spotId;
  req.body.user = req.user._id;
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }
  try {
    const newTicket = await Ticket.create(req.body);
    await User.findByIdAndUpdate(req.user._id, {
      $push: { tickets: newTicket._id },
    });
    res.status(200).json(newTicket);
  } catch (error) {
    next(error);
  }
};

exports.getTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find().populate("spot");
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

exports.deleteTicket = async (req, res, next) => {
  const { ticketId } = req.params;
  try {
    await Ticket.findByIdAndRemove({ _id: ticketId });
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { tickets: ticketId },
    });
    res.status(204).end();
    // res.status(200).json(organizer);
  } catch (err) {
    next(err);
  }
};
