const express=require('express');
const { getAllBookings } = require('../../Controllers/admin/bookingAllController');
const router=express.Router();

router.get('/bookings/all', getAllBookings);

module.exports=router;