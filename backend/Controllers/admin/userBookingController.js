const express = require("express");
const Booking = require("../../models/Booking");
const Train = require("../../models/Train");

exports.getUserBooking = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId });

    if (!bookings) {
      return res.status(404).json({ error: true, message: "no booking found" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "Server error. Please try again later." });
  }
};


