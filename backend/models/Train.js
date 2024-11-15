const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    seatNumber: { type: String, required: true },
    isBooked: { type: Boolean, default: false }
});

const compartmentSchema = new mongoose.Schema({
    compartmentName: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    price: { type: Number, required: true },
    seats: [seatSchema] 
});

const trainSchema = new mongoose.Schema({
    trainName: { type: String, required: true },
    trainNameS: { type: String, required: true },
    route: { type: [String], required: true }, 
    routeS: { type: [String], required: true }, 
    start: { type: String, required: true },
    startS: { type: String, required: true },
    operatingDays: { type: [String], required: true }, 
    departs: { type: String, required: true },
    arrives: { type: String, required: true },
    compartments: [compartmentSchema] 
});

const Train = mongoose.model('Train', trainSchema);

module.exports = Train;
