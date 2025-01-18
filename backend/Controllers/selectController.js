const Train = require("../models/Train");

exports.selectTrain= async (req, res) => {
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
}

// Book seats in a specific compartment
exports.trainBooking= async (req, res) => {
    const { seatNumbers, selectedDate, userId, username } = req.body; 
    const { trainId, compartmentName } = req.params;
    console.log(selectedDate);
    console.log("Seat Numbers:", seatNumbers);
   console.log("Selected Date:", selectedDate);

    // Validate seatNumbers input
    if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
        return res.status(400).json({ error: "Invalid seat selection" });
    }

    if (seatNumbers.length > 5) {
        return res.status(400).json({ error: "Maximum 5 seats can be booked at a time." });
    }

    try {
        // Fetch the train and validate its existence
        const train = await Train.findById(trainId);
        if (!train) return res.status(404).json({ error: "Train not found" });

        // Find the specified compartment
        const compartment = train.compartments.find(c => c.compartmentName === compartmentName);
        if (!compartment) {
            return res.status(404).json({ error: "Compartment not found" });
        }

        // Check for unavailable seats
        const unavailableSeats = seatNumbers.filter(seat => {
            const seatInCompartment = compartment.seats.find(s => s.seatNumber === seat);
            return !seatInCompartment;
        });

        if (unavailableSeats.length > 0) {
            return res.status(400).json({ error: `Seats ${unavailableSeats.join(', ')} are not available or already booked.` });
        }

        
        if (!compartment.arrivalTime) {
            compartment.arrivalTime = train.arrives; 
        }
       
        const expTime = selectedDate;

        const expTimes = new Set(); 
        compartment.seats.forEach(seat => {
            if (seatNumbers.includes(seat.seatNumber)) {
                if (!seat.isBooked) {
                    seat.isBooked = true;
                }

                
                if (!Array.isArray(seat.exp)) {
                    seat.exp = [];
                }

                
                if (!seat.exp.includes(expTime)) {
                    seat.exp.push(expTime);
                    expTimes.add(expTime);
                }
            }
        });

        compartment.availableSeats -= seatNumbers.length;

        await train.save();

        res.json({
            success: true,
            message: "Your seats are marked successfully!",
            remainingSeats: compartment.availableSeats,
            expTimes: Array.from(expTimes), 
        });
    } catch (error) {
        console.error("Error booking seats:", error);
        res.status(500).json({ error: "Booking failed. Please try again." });
    }
}


