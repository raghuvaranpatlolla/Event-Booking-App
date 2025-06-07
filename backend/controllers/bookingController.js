const Booking = require('../models/Booking');
const Event = require('../models/Event');

exports.bookEvent = async (req, res) => {
  const { eventId } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.attendees.length >= event.capacity)
      return res.status(400).json({ message: 'Event is fully booked' });

    if (event.attendees.includes(req.user._id))
      return res.status(400).json({ message: 'You have already booked this event' });

    const booking = await Booking.create({
      user: req.user._id,
      event: eventId
    });

    event.attendees.push(req.user._id);
    await event.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('event');
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });

    const event = await Event.findById(booking.event);
    event.attendees = event.attendees.filter(
      attendeeId => attendeeId.toString() !== req.user._id.toString()
    );
    await event.save();
    await booking.deleteOne();

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  // For admin usage
  try {
    const bookings = await Booking.find().populate('user').populate('event');
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};