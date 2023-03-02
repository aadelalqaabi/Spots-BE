const Ticket = require("../../models/Ticket");
const Spot = require("../../models/Spot");
const User = require("../../models/User");
const { email } = require("../../middleware/email");
const { generateToken } = require("../../middleware/generateToken");
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
    const spot = await Spot.findById(
      spotId,
      "name nameAr details detailsAr startTime startDate"
    );
    const user = await User.findById(req.body.user, "name");
    let ticket = {
      amount: req.body.amount,
      name: req.body.locale === ("en-US" || "en") ? spot.name : spot.nameAr,
      details:
        req.body.locale === ("en-US" || "en") ? spot.details : spot.detailsAr,
      startDate:
        req.body.locale === ("en-US" || "en")
          ? req.body.startDateEn
          : req.body.startDateAr,
      startTime: spot.startTime,
      image: spot.image,
      user: user.name,
    };
    delete req.body.locale;
    delete req.body.startDateAr;
    delete req.body.startDateEn;
    const newTicket = await Ticket.create(req.body);
    ticket = { ...ticket, id: newTicket._id };
    if (!req.user.email.includes("@privaterelay.appleid.com")) {
      email("ticket", req.user.email, `Your Dest Ticket`, ticket);
    } else {
    }
    const newUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { tickets: newTicket._id },
      },
      {
        new: true,
      }
    ).select("-password");
    const token = generateToken(newUser);
    res.status(200).json({ token, newTicket });
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
