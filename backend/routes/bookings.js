const express = require('express');
const router = express.Router();
const {
  bookEvent,
  getUserBookings,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, bookEvent);
router.get('/', protect, getUserBookings);
router.get('/all', protect, admin, getAllBookings); // admin only
router.delete('/:id', protect, cancelBooking);

module.exports = router;