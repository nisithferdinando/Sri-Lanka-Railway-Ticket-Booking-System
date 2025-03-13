const express=require('express');
const { getAllBookings, getAllBookingCount } = require('../../Controllers/admin/bookingAllController');
const router=express.Router();

router.get('/bookings/all', getAllBookings);
router.get('/bookings/count', getAllBookingCount);

module.exports=router;