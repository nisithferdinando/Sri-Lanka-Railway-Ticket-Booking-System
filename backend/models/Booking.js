
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true },
  userId: String,
  trainName: String,
  compartment: String,
  seatNumbers: [String],
  selectedDate: Date,
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
