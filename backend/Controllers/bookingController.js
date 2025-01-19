// controllers/bookingController.js
const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/Booking');

exports.saveBookingDetails = async (req, res) => {
  const { userId, trainName, compartment, seatNumbers, selectedDate, status } = req.body;

  try {
    const newBooking = new Booking({
      bookingId: uuidv4(),
      userId,
      trainName,
      compartment,
      seatNumbers,
      selectedDate,
      status
    });

    await newBooking.save();
    res.status(201).json({ success: true, message: 'Booking saved successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save booking.', error });
  }
};

exports.getBookingHistory = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user info from auth middleware
        
        // Get all bookings for the user
        let bookings = await Booking.find({ userId })
            .sort({ bookingDate: -1 }); // Sort by booking date, most recent first

        // Current date for comparison
        const currentDate = new Date();

        // Update status for expired bookings
        const updatedBookings = await Promise.all(bookings.map(async (booking) => {
            const bookingDoc = booking.toObject();
            
            // Check if the travel date has passed and booking is still active
            if (new Date(booking.selectedDate) < currentDate && booking.status === 'active') {
                // Update the booking status in the database
                await Booking.findByIdAndUpdate(booking._id, { status: 'expired' });
                bookingDoc.status = 'expired';
            }
            
            return {
                bookingId: bookingDoc.bookingId,
                bookingDate: bookingDoc.bookingDate.toISOString().split('T')[0],
                trainName: bookingDoc.trainName,
                compartment: bookingDoc.compartment,
                seatNumbers: bookingDoc.seatNumbers.join(', '),
                travelDate: bookingDoc.selectedDate.toISOString().split('T')[0],
                status: bookingDoc.status
            };
        }));

        res.status(200).json({
            success: true,
            bookings: updatedBookings
        });

    } catch (error) {
        console.error('Error fetching booking history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking history'
        });
    }
};
