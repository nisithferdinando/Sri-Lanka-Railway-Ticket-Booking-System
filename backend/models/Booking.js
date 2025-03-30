const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true },
  userId: String,
  email: String,
  trainName: String,
  compartment: String,
  seatNumbers: [String],
  selectedDate: Date,
  bookingDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["active", "cancelled", "expired"],
    default: "active",
  },
  refundStatus: {
    type: String,
    enum: ["not_applied", "applied", "processing", "completed", "failed"],
    default: "not_applied",
  },
  refundAccept: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
