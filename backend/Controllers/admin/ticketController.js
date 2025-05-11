const Booking = require("../../models/Booking");

exports.verifyTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Find booking with the given ticketId
    const booking = await Booking.findOne({ ticketId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      booking: {
        bookingId: booking.bookingId,
        ticketId: booking.ticketId,
        trainName: booking.trainName,
        compartment: booking.compartment,
        seatNumbers: booking.seatNumbers,
        selectedDate: booking.selectedDate,
        status: booking.status,
        bookingApproval: booking.bookingApproval,
      },
    });
  } catch (error) {
    console.error("Error verifying ticket:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while verifying ticket",
    });
  }
};

exports.approveTicket = async (req, res) => {
  try {
    const { ticketId, bookingId } = req.body;

    if (!ticketId || !bookingId) {
      return res.status(400).json({
        success: false,
        message: "Ticket ID and Booking ID are required",
      });
    }

    // Find and update the booking
    const booking = await Booking.findOne({
      ticketId,
      bookingId,
      status: "active", // Only allow approval for active bookings
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Active booking with the provided details not found",
      });
    }

    // Update booking approval status
    booking.bookingApproval = "approved";
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Ticket approved successfully",
      booking: {
        bookingId: booking.bookingId,
        ticketId: booking.ticketId,
        bookingApproval: booking.bookingApproval,
      },
    });
  } catch (error) {
    console.error("Error approving ticket:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while approving ticket",
    });
  }
};
