const { v4: uuidv4 } = require("uuid");
const Booking = require("../models/Booking");
const Train = require("../models/Train");

// Existing saveBookingDetails remains the same

exports.saveBookingDetails = async (req, res) => {
  const {
    userId,
    trainName,
    compartment,
    seatNumbers,
    selectedDate,
    status,
    email,
  } = req.body;

  try {
    const newBooking = new Booking({
      bookingId: uuidv4(),
      userId,
      trainName,
      compartment,
      seatNumbers,
      selectedDate,
      status,
      email,
    });

    await newBooking.save();
    res
      .status(201)
      .json({ success: true, message: "Booking saved successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to save booking.", error });
  }
};

exports.applyForRefund = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    // Find the booking
    const booking = await Booking.findOne({ bookingId, userId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if refund is already applied
    if (booking.refundStatus === "applied") {
      return res.status(400).json({
        success: false,
        message: "Refund already applied",
      });
    }

    // Check travel date for refund eligibility
    const travelDate = new Date(booking.selectedDate);
    const currentDate = new Date();
    const refundEligibilityDate = new Date(travelDate);
    refundEligibilityDate.setDate(refundEligibilityDate.getDate() + 2);

    if (currentDate > refundEligibilityDate) {
      return res.status(400).json({
        success: false,
        message: "Refund is no longer possible. Deadline has passed.",
      });
    }

    // Update refund status
    booking.refundStatus = "applied";
    booking.refundAccept = "pending";
    booking.status = "cancelled"; // Automatically cancel the booking

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Refund application submitted successfully",
      refundStatus: booking.refundStatus,
      refundAccept: booking.refundAccept,
    });
  } catch (error) {
    console.error("Error applying for refund:", error);
    res.status(500).json({
      success: false,
      message: "Error applying for refund",
      error: error.message,
    });
  }
};

// Modify getBookingHistory to include refund fields
exports.getBookingHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date();

    let bookings = await Booking.find({ userId }).sort({ bookingDate: -1 });

    const updatedBookings = bookings.map((booking) => ({
      bookingId: booking.bookingId,
      bookingDate: booking.bookingDate.toISOString().split("T")[0],
      trainName: booking.trainName,
      compartment: booking.compartment,
      seatNumbers: booking.seatNumbers.join(", "),
      travelDate: booking.selectedDate.toISOString().split("T")[0],
      status: booking.status,
      refundStatus: booking.refundStatus,
      refundAccept: booking.refundAccept,
    }));

    res.status(200).json({
      success: true,
      bookings: updatedBookings,
    });
  } catch (error) {
    console.error("Error fetching booking history:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching booking history",
    });
  }
};

// Modify cancelBooking to reset refund fields
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking
    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if booking is already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    // Find the train
    const train = await Train.findOne({
      trainName: booking.trainName,
    });

    if (!train) {
      return res.status(404).json({
        success: false,
        message: "Train not found",
      });
    }

    // Find the compartment and seats
    const compartment = train.compartments.find(
      (comp) => comp.compartmentName === booking.compartment
    );

    if (!compartment) {
      return res.status(404).json({
        success: false,
        message: "Compartment not found",
      });
    }

    const seatNumbersArray = Array.isArray(booking.seatNumbers)
      ? booking.seatNumbers
      : booking.seatNumbers.split(",").map((seat) => seat.trim());

    // Convert booking selected date
    const selectedDateStr = new Date(booking.selectedDate)
      .toISOString()
      .split("T")[0];

    // Remove the selected date from exp array
    let updatedSeats = false;
    compartment.seats.forEach((seat) => {
      if (seatNumbersArray.includes(seat.seatNumber)) {
        // Convert each exp date
        seat.exp = seat.exp.filter((date) => {
          const expDateStr = new Date(date).toISOString().split("T")[0];
          return expDateStr !== selectedDateStr;
        });
        updatedSeats = true;
      }
    });

    if (!updatedSeats) {
      return res.status(404).json({
        success: false,
        message: "Seats not found",
      });
    }

    // Save the train
    await train.save();

    // Update booking status
    booking.status = "cancelled";
    booking.refundStatus = "not_applied";
    booking.refundAccept = "pending";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Error in cancelBooking:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling booking",
      error: error.message,
    });
  }
};
