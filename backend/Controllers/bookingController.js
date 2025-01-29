// controllers/bookingController.js
const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/Booking');
const Train = require('../models/Train');


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
        const userId = req.user.id; 
        
        
        let bookings = await Booking.find({ userId })
            .sort({ bookingDate: -1 }); 

        
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
exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
       
        // Find the booking
        const booking = await Booking.findOne({ bookingId });
       
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking is already cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        // Find the train
        const train = await Train.findOne({
            trainName: booking.trainName
        });

        if (!train) {
            return res.status(404).json({
                success: false,
                message: 'Train not found'
            });
        }

        // Find the compartment and seats
        const compartment = train.compartments.find(comp =>
            comp.compartmentName === booking.compartment
        );

        if (!compartment) {
            return res.status(404).json({
                success: false,
                message: 'Compartment not found'
            });
        }

        
        const seatNumbersArray = Array.isArray(booking.seatNumbers)
            ? booking.seatNumbers
            : booking.seatNumbers.split(',').map(seat => seat.trim());

        // Convert booking selected date 
        const selectedDateStr = new Date(booking.selectedDate).toISOString().split('T')[0];
        
        // Remove the selected date from exp array 
        let updatedSeats = false;
        compartment.seats.forEach(seat => {
            if (seatNumbersArray.includes(seat.seatNumber)) {
                // Convert each exp date 
                seat.exp = seat.exp.filter(date => {
                    const expDateStr = new Date(date).toISOString().split('T')[0];
                    return expDateStr !== selectedDateStr;
                });
                updatedSeats = true;
            }
        });

        if (!updatedSeats) {
            return res.status(404).json({
                success: false,
                message: 'Seats not found'
            });
        }

        // Save the train
        await train.save();

        // Update booking status to cancelled
        booking.status = 'cancelled';
        await booking.save();

        console.log(`Successfully cancelled booking ${bookingId} and removed date ${selectedDateStr}`);

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully'
        });

    } catch (error) {
        console.error('Error in cancelBooking:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error.message
        });
    }
};
