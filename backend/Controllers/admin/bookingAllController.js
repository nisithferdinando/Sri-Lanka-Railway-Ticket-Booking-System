const express = require("express");
const mongoose = require("mongoose");
const Booking = require("../../models/Booking");
const Train = require("../../models/Train");

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    if (bookings.length === 0) {
      return res.status(404).json({ error: true, message: "no booking found" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "Server error. Please try again later" });
  }
};
exports.processRefund = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const action = req.body.action || "accepted";

    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      booking.refundStatus !== "applied" ||
      booking.refundAccept !== "pending"
    ) {
      return res.status(400).json({
        success: false,
        message: "This booking is not eligible for refund processing",
      });
    }

    booking.refundAccept = action;

    if (action === "accepted") {
      booking.refundStatus = "processing";
      await booking.save();

      const train = await Train.findOne({ trainName: booking.trainName });

      if (train) {
        const compartment = train.compartments.find(
          (comp) => comp.compartmentName === booking.compartment
        );

        if (compartment) {
          const seatNumbersArray = booking.seatNumbers;
          const selectedDateStr = new Date(booking.selectedDate)
            .toISOString()
            .split("T")[0];

          compartment.seats.forEach((seat) => {
            if (seatNumbersArray.includes(seat.seatNumber)) {
              // Remove the booking date from the exception dates
              seat.exp = seat.exp.filter((date) => {
                const expDateStr = new Date(date).toISOString().split("T")[0];
                return expDateStr !== selectedDateStr;
              });
            }
          });

          await train.save();
        }
      }

      booking.refundStatus = "completed";
      await booking.save();
    } else {
      booking.refundStatus = "not_applied";
      await booking.save();
    }

    res.status(200).json({
      success: true,
      message: `Refund ${action} successfully`,
      refundStatus: booking.refundStatus,
      refundAccept: booking.refundAccept,
    });
  } catch (error) {
    console.error("Error processing refund:", error);

    res.status(500).json({
      success: false,
      message: "Error processing refund",
      error: error.message,
    });
  }
};

exports.getAllBookingCount = async (req, res) => {
  try {
    const count = await Booking.countDocuments({});
    res.status(200).json(count);
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "error in fetching booking counr" });
  }
};
