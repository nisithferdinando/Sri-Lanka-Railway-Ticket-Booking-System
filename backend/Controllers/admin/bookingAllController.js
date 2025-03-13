const express=require('express');
const Booking = require("../../models/Booking");


exports.getAllBookings = async(req, res) => {
    try {
        const bookings = await Booking.find();
        if(bookings.length === 0) {
            return res.status(404).json({error: true, message: "no booking found"});
        }
        res.status(200).json(bookings);
    } catch(error) {
        res.status(500).json({error: true, message: "Server error. Please try again later"});
    }
};

exports.getAllBookingCount=async(req, res)=>{
    try{
        const count=await Booking.countDocuments({});
        res.status(200).json(count);
    }
    catch(error){
        res.status(500).json({error:true, message:"error in fetching booking counr"});
    }
};