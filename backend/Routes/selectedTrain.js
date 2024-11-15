const express = require('express');
const router = express.Router();
const Train = require('../models/Train'); 

// Get a specific train by ID
router.get("/:trainId", async (req, res) => {
    const { trainId } = req.params;

    try {
        const train = await Train.findById(trainId).populate('compartments');

        if (!train) {
            return res.status(404).json({ error: "Train not found" });
        }

        res.json(train);
    } catch (error) {
        console.error("Error fetching train data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Book seats in a specific compartment
router.post("/:trainId/compartment/:compartmentName/book", async (req, res) => {
    const { seatNumbers } = req.body; // Seat numbers being booked
    const {trainId, compartmentName}=req.params;
    if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
        return res.status(400).json({ error: "Invalid seat selection" });
    }
 
    if (seatNumbers.length > 5) {
        return res.status(400).json({ error: "Maximum 5 seats can be booked at a time." });
    }
 
    try {
        const train = await Train.findById(req.params.trainId); // Fetch the train
        if (!train) return res.status(404).json({ error: "Train not found" });

        // Find the specified compartment
        const compartment = train.compartments.find(c => c.compartmentName === req.params.compartmentName);
 
        if (!compartment) {
            return res.status(404).json({ error: "Compartment not found" });
        }

        // Check if the requested seats are available in the compartment
        const unavailableSeats = seatNumbers.filter(seat => {
            const seatInCompartment = compartment.seats.find(s => s.seatNumber === seat);
            return !seatInCompartment || seatInCompartment.isBooked;
        });

        if (unavailableSeats.length > 0) {
            return res.status(400).json({ error: `Seats ${unavailableSeats.join(', ')} are not available.` });
        }

        // Mark seats as booked
        compartment.seats.forEach(seat => {
            if (seatNumbers.includes(seat.seatNumber)) {
                seat.isBooked = true; // Mark the seat as booked
            }
        });

        // Update available seats count
        compartment.availableSeats -= seatNumbers.length;

        await train.save();

        res.json({ success: true, message: "Seats booked successfully!", remainingSeats: compartment.availableSeats });
    }
     catch (error) {
        res.status(500).json({ error: "Booking failed. Please try again." });
    }
});

module.exports = router;